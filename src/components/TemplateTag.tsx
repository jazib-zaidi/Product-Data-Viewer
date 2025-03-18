
import { X } from "lucide-react";
import { getFieldDisplayName } from "@/utils/templateUtils";

interface TemplateTagProps {
  fieldName: string;
  onRemove: () => void;
}

const TemplateTag = ({ fieldName, onRemove }: TemplateTagProps) => {
  return (
    <div className="template-tag group animate-appear">
      <span>{getFieldDisplayName(fieldName)}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1.5 p-0.5 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Remove field"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default TemplateTag;
