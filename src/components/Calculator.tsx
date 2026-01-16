import { useState, useEffect, useCallback } from "react";
import { CalculatorButton } from "./CalculatorButton";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorHistory, HistoryEntry } from "./CalculatorHistory";
import { useClickSound } from "@/hooks/useClickSound";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentExpression, setCurrentExpression] = useState<string>("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const { playClick } = useClickSound();

  // Map keyboard keys to button labels
  const getButtonLabel = (key: string): string => {
    const keyMap: Record<string, string> = {
      "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
      "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
      ".": ".", ",": ".",
      "+": "+", "-": "−", "*": "×", "x": "×", "X": "×", "/": "÷",
      "=": "=", "Enter": "=",
      "Escape": "AC", "c": "AC", "C": "AC",
      "%": "%",
    };
    return keyMap[key] || "";
  };

  const addToHistory = (expression: string, result: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 20));
  };

  const inputDigit = useCallback((digit: string) => {
    setDisplay((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      }
      return prev === "0" ? digit : prev + digit;
    });
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    setDisplay((prev) => {
      if (!prev.includes(".")) {
        return prev + ".";
      }
      return prev;
    });
  }, [waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setCurrentExpression("");
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => {
      if (prev.length === 1 || (prev.length === 2 && prev.startsWith("-"))) {
        return "0";
      }
      return prev.slice(0, -1);
    });
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((prev) => String(parseFloat(prev) * -1));
  }, []);

  const inputPercent = useCallback(() => {
    setDisplay((prev) => String(parseFloat(prev) / 100));
  }, []);

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setCurrentExpression(`${formatNumber(inputValue)} ${nextOperator}`);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(result);
      setCurrentExpression(`${formatNumber(result)} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "×":
        return left * right;
      case "÷":
        return right !== 0 ? left / right : 0;
      default:
        return right;
    }
  };

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e9) {
      return num.toExponential(4);
    }
    const str = String(num);
    const parts = str.split(".");
    if (parts[1] && parts[1].length > 6) {
      return num.toFixed(6).replace(/\.?0+$/, "");
    }
    return str;
  };

  const handleEquals = useCallback(() => {
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operator);
      const expression = `${formatNumber(previousValue)} ${operator} ${formatNumber(inputValue)}`;
      
      addToHistory(expression, formatNumber(result));
      
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setCurrentExpression("");
    }
  }, [operator, previousValue, display]);

  const handleHistoryClick = (result: string) => {
    setDisplay(result);
    setWaitingForOperand(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for calculator keys
      if (
        /^[0-9.]$/.test(e.key) ||
        ["+", "-", "*", "/", "=", "Enter", "Escape", "Backspace", "%", "c", "C", "x", "X", ","].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Set pressed key for visual feedback
      const buttonLabel = getButtonLabel(e.key);
      if (buttonLabel) {
        setPressedKey(buttonLabel);
        setTimeout(() => setPressedKey(null), 150);
      }

      // Numbers
      if (/^[0-9]$/.test(e.key)) {
        playClick("number");
        inputDigit(e.key);
        return;
      }

      // Decimal
      if (e.key === "." || e.key === ",") {
        playClick("number");
        inputDecimal();
        return;
      }

      // Operators
      switch (e.key) {
        case "+":
          playClick("operator");
          performOperation("+");
          break;
        case "-":
          playClick("operator");
          performOperation("-");
          break;
        case "*":
        case "x":
        case "X":
          playClick("operator");
          performOperation("×");
          break;
        case "/":
          playClick("operator");
          performOperation("÷");
          break;
        case "=":
        case "Enter":
          playClick("operator");
          handleEquals();
          break;
        case "Escape":
        case "c":
        case "C":
          playClick("function");
          clear();
          break;
        case "Backspace":
          playClick("number");
          backspace();
          break;
        case "%":
          playClick("function");
          inputPercent();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputDigit, inputDecimal, clear, backspace, inputPercent, handleEquals, playClick]);

  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0";
    
    if (value.includes(".") && value.endsWith(".")) {
      return value;
    }
    
    if (Math.abs(num) >= 1e9) {
      return num.toExponential(4);
    }
    
    const parts = value.split(".");
    if (parts[1] && parts[1].length > 8) {
      return num.toFixed(8).replace(/\.?0+$/, "");
    }
    
    return value;
  };

  return (
    <div className="glass-container rounded-[2.5rem] p-6 w-[340px] shadow-2xl">
      {/* History */}
      <div className="border-b border-white/10 mb-2">
        <CalculatorHistory history={history} onEntryClick={handleHistoryClick} />
      </div>

      {/* Current Expression */}
      {currentExpression && (
        <div className="text-right px-2 text-muted-foreground text-sm opacity-70">
          {currentExpression}
        </div>
      )}

      {/* Display */}
      <CalculatorDisplay value={formatDisplay(display)} />
      
      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <CalculatorButton 
          variant="function" 
          onClick={clear}
          isPressed={pressedKey === "AC"}
        >
          {display === "0" && previousValue === null ? "AC" : "C"}
        </CalculatorButton>
        <CalculatorButton 
          variant="function" 
          onClick={toggleSign}
          isPressed={pressedKey === "±"}
        >
          ±
        </CalculatorButton>
        <CalculatorButton 
          variant="function" 
          onClick={inputPercent}
          isPressed={pressedKey === "%"}
        >
          %
        </CalculatorButton>
        <CalculatorButton 
          variant="operator" 
          onClick={() => performOperation("÷")}
          isActive={operator === "÷" && waitingForOperand}
          isPressed={pressedKey === "÷"}
        >
          ÷
        </CalculatorButton>

        {/* Row 2 */}
        <CalculatorButton onClick={() => inputDigit("7")} isPressed={pressedKey === "7"}>7</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit("8")} isPressed={pressedKey === "8"}>8</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit("9")} isPressed={pressedKey === "9"}>9</CalculatorButton>
        <CalculatorButton 
          variant="operator" 
          onClick={() => performOperation("×")}
          isActive={operator === "×" && waitingForOperand}
          isPressed={pressedKey === "×"}
        >
          ×
        </CalculatorButton>

        {/* Row 3 */}
        <CalculatorButton onClick={() => inputDigit("4")} isPressed={pressedKey === "4"}>4</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit("5")} isPressed={pressedKey === "5"}>5</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit("6")} isPressed={pressedKey === "6"}>6</CalculatorButton>
        <CalculatorButton 
          variant="operator" 
          onClick={() => performOperation("-")}
          isActive={operator === "-" && waitingForOperand}
          isPressed={pressedKey === "−"}
        >
          −
        </CalculatorButton>

        {/* Row 4 */}
        <CalculatorButton onClick={() => inputDigit("1")} isPressed={pressedKey === "1"}>1</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit("2")} isPressed={pressedKey === "2"}>2</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit("3")} isPressed={pressedKey === "3"}>3</CalculatorButton>
        <CalculatorButton 
          variant="operator" 
          onClick={() => performOperation("+")}
          isActive={operator === "+" && waitingForOperand}
          isPressed={pressedKey === "+"}
        >
          +
        </CalculatorButton>

        {/* Row 5 */}
        <CalculatorButton onClick={() => inputDigit("0")} className="col-span-2" isPressed={pressedKey === "0"}>
          0
        </CalculatorButton>
        <CalculatorButton onClick={inputDecimal} isPressed={pressedKey === "."}>.</CalculatorButton>
        <CalculatorButton variant="operator" onClick={handleEquals} isPressed={pressedKey === "="}>
          =
        </CalculatorButton>
      </div>
    </div>
  );
};
