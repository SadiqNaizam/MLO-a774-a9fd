import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

interface ColorOption {
  id: string | number;
  name: string; // e.g., "Red", "Midnight Blue"
  hexValue: string; // e.g., "#FF0000", "#00008B"
  isAvailable?: boolean;
}

interface ColorSwatchSelectorProps {
  options: ColorOption[];
  selectedColorId: string | number | null;
  onColorSelect: (colorId: string | number) => void;
  swatchSize?: string; // e.g., "w-8 h-8"
}

const ColorSwatchSelector: React.FC<ColorSwatchSelectorProps> = ({
  options,
  selectedColorId,
  onColorSelect,
  swatchSize = 'w-8 h-8',
}) => {
  console.log("Rendering ColorSwatchSelector, selected:", selectedColorId);

  if (!options || options.length === 0) {
    return null; // Or some placeholder if desired
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {options.map((color) => {
        const isSelected = color.id === selectedColorId;
        const isAvailable = color.isAvailable !== false; // Default to true if undefined

        return (
          <button
            key={color.id}
            type="button"
            onClick={() => isAvailable && onColorSelect(color.id)}
            disabled={!isAvailable}
            className={cn(
              "rounded-full border-2 flex items-center justify-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              swatchSize,
              isSelected ? 'border-primary scale-110' : 'border-muted hover:border-foreground/50',
              !isAvailable && "opacity-50 cursor-not-allowed relative"
            )}
            style={{ backgroundColor: color.hexValue }}
            aria-label={`Select color ${color.name}${!isAvailable ? ' (Unavailable)' : ''}`}
            aria-pressed={isSelected}
          >
            {isSelected && <Check className="w-1/2 h-1/2 text-white mix-blend-difference" />}
            {!isAvailable && (
              // Diagonal line for unavailable
              <span
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg className="w-full h-full text-destructive/70" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="8" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ColorSwatchSelector;