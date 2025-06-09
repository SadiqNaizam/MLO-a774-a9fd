import React from 'react';
import { Button } from '@/components/ui/button'; // Using Button for base styling and accessibility
import { cn } from "@/lib/utils";

interface VariantOption {
  id: string | number;
  label: string; // e.g., "S", "M", "XL", "32GB"
  isAvailable?: boolean;
}

interface VariantOptionPillsProps {
  options: VariantOption[];
  selectedOptionId: string | number | null;
  onOptionSelect: (optionId: string | number) => void;
  variantGroupName?: string; // e.g., "Size", "Capacity" for ARIA labels
}

const VariantOptionPills: React.FC<VariantOptionPillsProps> = ({
  options,
  selectedOptionId,
  onOptionSelect,
  variantGroupName = 'option',
}) => {
  console.log("Rendering VariantOptionPills, selected:", selectedOptionId);

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Select ${variantGroupName}`}>
      {options.map((option) => {
        const isSelected = option.id === selectedOptionId;
        const isAvailable = option.isAvailable !== false; // Default to true

        return (
          <Button
            key={option.id}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => isAvailable && onOptionSelect(option.id)}
            disabled={!isAvailable}
            className={cn(
              "transition-all duration-150",
              !isAvailable && "text-muted-foreground line-through"
            )}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${option.label}${!isAvailable ? ' (Unavailable)' : ''}`}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default VariantOptionPills;