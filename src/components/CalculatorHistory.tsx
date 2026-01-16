import { ScrollArea } from "@/components/ui/scroll-area";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
}

interface CalculatorHistoryProps {
  history: HistoryEntry[];
  onEntryClick: (result: string) => void;
}

export const CalculatorHistory = ({ history, onEntryClick }: CalculatorHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center">
        <span className="text-muted-foreground text-sm opacity-50">
          Histórico vazio
        </span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-24">
      <div className="flex flex-col gap-1 px-2">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onEntryClick(entry.result)}
            className="text-right py-1 px-2 rounded-lg transition-all duration-200 hover:bg-white/5 group"
          >
            <div className="text-muted-foreground text-sm opacity-70 group-hover:opacity-100 transition-opacity">
              {entry.expression}
            </div>
            <div className="text-foreground text-lg font-light">
              = {entry.result}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
