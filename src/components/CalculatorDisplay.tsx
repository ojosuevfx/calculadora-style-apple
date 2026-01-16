import { useEffect, useState, useRef } from "react";

interface CalculatorDisplayProps {
  value: string;
}

export const CalculatorDisplay = ({ value }: CalculatorDisplayProps) => {
  const [isPopping, setIsPopping] = useState(false);
  const prevValueRef = useRef(value);

  // Trigger pop animation when value changes
  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 150);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Calculate font size based on value length
  const getFontSize = () => {
    const length = value.replace("-", "").length;
    if (length <= 6) return "text-7xl";
    if (length <= 8) return "text-6xl";
    if (length <= 10) return "text-5xl";
    return "text-4xl";
  };

  return (
    <div className="h-28 flex items-end justify-end px-2 mb-4 overflow-hidden">
      <span
        className={`text-display text-foreground ${getFontSize()} truncate`}
        style={{
          transition: "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isPopping ? "scale(1.08)" : "scale(1)",
          textShadow: isPopping ? "0 0 20px hsl(var(--primary) / 0.5)" : "none",
        }}
      >
        {value}
      </span>
    </div>
  );
};
