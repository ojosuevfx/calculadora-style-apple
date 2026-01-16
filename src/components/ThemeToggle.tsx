import { Moon, Sun } from "lucide-react";
import { useClickSound } from "@/hooks/useClickSound";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
  isLoaded?: boolean;
}

export const ThemeToggle = ({ isLoaded = true }: ThemeToggleProps) => {
  const { playClick } = useClickSound();
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("calculator-theme");
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(true); // Default dark
    }
  }, []);

  // Apply theme class whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("calculator-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleClick = () => {
    playClick("function");
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`fixed top-4 left-4 md:left-auto md:right-4 z-50 p-3 rounded-full glass-button hover:scale-110 active:scale-95 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
      style={{ 
        transition: "all 0.5s ease",
        transitionDelay: isLoaded ? "500ms" : "0ms" 
      }}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 text-primary ${
            isDark
              ? "opacity-0 rotate-180 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
          style={{ transition: "all 0.5s ease" }}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 text-foreground ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-180 scale-0"
          }`}
          style={{ transition: "all 0.5s ease" }}
        />
      </div>
    </button>
  );
};
