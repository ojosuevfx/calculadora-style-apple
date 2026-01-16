import { useState, useEffect } from "react";
import { Calculator } from "@/components/Calculator";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-500">
      {/* Theme Toggle - fixed position, top right */}
      <ThemeToggle isLoaded={isLoaded} />
      
      {/* Ambient glow effects */}
      <div 
        className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[128px] animate-glow-pulse transition-all duration-1000 bg-[hsl(var(--glow-color))] ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`} 
      />
      <div 
        className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[128px] animate-glow-pulse transition-all duration-1000 delay-300 bg-[hsl(var(--glow-color))] ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
        style={{ animationDelay: "1s" }} 
      />
      
      {/* Subtle grid pattern */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 delay-700 ${
          isLoaded ? "opacity-[0.02]" : "opacity-0"
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Calculator with entrance animation */}
      <div
        className={`transition-all duration-700 ease-out ${
          isLoaded 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <Calculator />
      </div>
    </div>
  );
};

export default Index;
