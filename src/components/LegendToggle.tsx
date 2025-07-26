import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";

export const LegendToggle = () => {
  return (
    <div className="relative w-full sm:mt-4 mt-2">
      {/* Mobile: show button and popover inside card */}
      <div className="sm:hidden flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </PopoverTrigger>

          {/* Force the popover to render within this container */}
          <PopoverContent
            align="center"
            side="top"
            sideOffset={10}
            className="absolute z-20 right-8 mt-1 w-40 text-xs space-y-2 shadow-lg border-muted bg-muted/50 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold mb-1">Legend</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-full" />
              <span>Pending Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 border border-yellow-600 rounded-full" />
              <span>Next Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-full" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-500"
                style={{ transform: "rotate(90deg)" }}
              />
              <span>Disk Head</span>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop: always show legend */}
      <div className="hidden sm:flex justify-end px-5 mt-2">
        <div className="text-xs space-y-2">
            <p className="text-sm font-semibold mb-1">Legend</p>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-full" />
            <span>Pending Request</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 border border-yellow-600 rounded-full" />
            <span>Next Request</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-full" />
            <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
            <div
                className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-500"
                style={{ transform: "rotate(90deg)" }}
            />
            <span>Disk Head</span>
            </div>
        </div>
      </div>
    </div>
  );
};
