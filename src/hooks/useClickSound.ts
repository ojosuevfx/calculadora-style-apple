import { useCallback, useRef } from "react";

type SoundType = "number" | "function" | "operator";

export const useClickSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback((type: SoundType = "number") => {
    const audioContext = getAudioContext();
    
    // Create oscillator for the click sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound based on button type
    const now = audioContext.currentTime;
    
    switch (type) {
      case "operator":
        // Higher pitch, slightly longer for operators
        oscillator.frequency.setValueAtTime(1200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        oscillator.start(now);
        oscillator.stop(now + 0.08);
        break;
        
      case "function":
        // Mid pitch for function buttons (AC, ±, %)
        oscillator.frequency.setValueAtTime(900, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.04);
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        oscillator.start(now);
        oscillator.stop(now + 0.06);
        break;
        
      default:
        // Soft, subtle click for numbers
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.03);
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        oscillator.start(now);
        oscillator.stop(now + 0.04);
        break;
    }
  }, [getAudioContext]);

  return { playClick };
};
