import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // For potential clear/apply filter buttons
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isOpen?: boolean; // For mobile/collapsible sidebars
  onClose?: () => void; // For mobile/collapsible sidebars
  showApplyButton?: boolean;
  onApplyFilters?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  title = "Filters",
  className,
  isOpen = true, // Default to open for desktop
  onClose,
  showApplyButton = false,
  onApplyFilters
}) => {
  console.log("Rendering Sidebar, title:", title, "isOpen:", isOpen);

  if (!isOpen && !className?.includes('md:block')) { // If controlled and closed, and not inherently responsive
      return null;
  }

  return (
    // For mobile, this could be a Sheet or Dialog. For desktop, a static aside.
    // This example is for a static desktop sidebar, responsive via className.
    <aside
      className={cn(
        "bg-background border-r flex-shrink-0", // Base styles
        "w-64 lg:w-72 space-y-4 p-4 ", // Desktop static styles
        "h-full ", // Full height
        onClose ? "fixed inset-y-0 left-0 z-40 md:static md:inset-auto" : "sticky top-16", // Conditional positioning
        !isOpen && onClose ? "hidden" : "flex flex-col", // Visibility if controlled
        className // Allow overrides
      )}
      aria-labelledby={title ? "sidebar-title" : undefined}
    >
      <div className="flex justify-between items-center">
        {title && <h2 id="sidebar-title" className="text-lg font-semibold text-foreground">{title}</h2>}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator />
      <ScrollArea className="flex-grow pr-2 -mr-2"> {/* Negative margin to hide scrollbar visually if desired */}
        <div className="space-y-6 pb-4">
          {children ? children : (
            <p className="text-muted-foreground text-sm">No filters available.</p>
          )}
        </div>
      </ScrollArea>
      {showApplyButton && onApplyFilters && (
        <>
          <Separator />
          <div className="pt-4">
            <Button className="w-full" onClick={onApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;