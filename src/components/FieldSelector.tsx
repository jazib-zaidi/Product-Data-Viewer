
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getFieldDisplayName } from "@/utils/templateUtils";
import { Plus } from "lucide-react";

interface FieldSelectorProps {
  fields: { [key: string]: string };
  onSelectField: (fieldName: string) => void;
}

const FieldSelector = ({ fields, onSelectField }: FieldSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFields = Object.keys(fields).filter(field => 
    getFieldDisplayName(field).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus input when popover opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm h-10"
        >
          <Plus size={16} />
          <span>Add Field</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 animate-scale-in" align="start">
        <div className="p-3 border-b">
          <Input
            ref={inputRef}
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {filteredFields.length > 0 ? (
              filteredFields.map((fieldName) => (
                <button
                  key={fieldName}
                  className="w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    onSelectField(fieldName);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="font-medium">{getFieldDisplayName(fieldName)}</div>
                  <div className="text-xs text-gray-500 truncate">{fieldName}</div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                No matching fields found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default FieldSelector;
