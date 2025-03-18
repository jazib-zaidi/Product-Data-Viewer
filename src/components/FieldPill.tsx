import { getFieldDisplayName } from '@/utils/templateUtils';
import { Plus } from 'lucide-react';

interface FieldPillProps {
  fieldName: string;
  onClick: () => void;
}

const FieldPill = ({ fieldName, onClick }: FieldPillProps) => {
  return (
    <button
      className='template-pill inline-flex items-center gap-1.5 animate-appear'
      onClick={onClick}
      title={`Add ${getFieldDisplayName(fieldName)}`}
    >
      <Plus size={14} />
      <span>{getFieldDisplayName(fieldName)}</span>
    </button>
  );
};

export default FieldPill;
