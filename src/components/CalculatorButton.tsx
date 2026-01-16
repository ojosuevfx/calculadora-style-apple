import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useClickSound } from "@/hooks/useClickSound";

interface CalculatorButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: "number" | "function" | "operator";
  isActive?: boolean;
  isPressed?: boolean;
  className?: string;
}

export const CalculatorButton = ({
  children,
  onClick,
  variant = "number",
  isActive = false,
  isPressed = false,
  className,
}: CalculatorButtonProps) => {
  const { playClick } = useClickSound();

  const handleClick = () => {
    playClick(variant);
    onClick();
  };

  const baseStyles = cn(
    "glass-button",
    "h-[72px] rounded-full",
    "flex items-center justify-center",
    "text-3xl font-light text-foreground",
    "select-none cursor-pointer",
    "transition-all duration-150",
    isPressed && "scale-95 brightness-125"
  );

  const variantStyles = {
    number: cn(isPressed && "bg-white/25"),
    function: cn(
      "glass-button-function text-accent-foreground",
      isPressed && "bg-white/40"
    ),
    operator: cn(
      "glass-button-operator text-primary-foreground",
      isActive && "active",
      isPressed && "brightness-125 scale-95"
    ),
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
