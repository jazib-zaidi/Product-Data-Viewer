import { useState, useEffect, useRef } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { extractFields, generateUniqueId } from '../utils/templateUtils';
import FieldSelector from './FieldSelector';
import TemplateTag from './TemplateTag';
import FieldPill from './FieldPill';
import { ProductData, TemplateItem } from '../types/template';
import { toast } from './ui/use-toast';
import { Copy, Save, X } from 'lucide-react';

interface DescriptionTemplateProps {
  data: ProductData;
}

const DescriptionTemplate = ({ data }: DescriptionTemplateProps) => {
  console.log(data);
  const [fields, setFields] = useState<{ [key: string]: string }>({});
  const [template, setTemplate] = useState<TemplateItem[]>([]);
  const [textInput, setTextInput] = useState('');
  const [preview, setPreview] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract fields from the product data
  useEffect(() => {
    const extractedFields = extractFields(data);
    setFields(extractedFields);
  }, [data]);

  const randomDarkColor = () => {
    const colors = [
      `rgb(${Math.floor(Math.random() * 156)}, 0, 0)`, // Dark Red
      `rgb(${Math.floor(Math.random() * 156)}, ${Math.floor(
        Math.random() * 156
      )}, 0)`, // Dark Yellow
      `rgb(0, 0, ${Math.floor(Math.random() * 156)})`, // Dark Blue
      `rgb(0, ${Math.floor(Math.random() * 156)}, 0)`, // Dark Green
    ];

    // Pick a random color from the list
    const randomDarkColor = colors[Math.floor(Math.random() * colors.length)];

    return randomDarkColor;
  };
  // Generate preview whenever template changes
  useEffect(() => {
    let result = '';

    template.forEach((item) => {
      // Generate dark color by keeping RGB values low

      if (item.type === 'text') {
        result += ` <span style="color: ${randomDarkColor()}">${
          item.content
        } </span>`;
      } else if (item.type === 'field' && item.field) {
        result +=
          `<span style="color: ${randomDarkColor()}">${
            fields[item.field]
          } </span>` ||
          `<span style="color: ${randomDarkColor()}"> [${item.field}] </span> `;
      }
    });

    setPreview(result);
  }, [template, fields]);

  // Add a field to the template
  const addField = (fieldName: string) => {
    const newItem: TemplateItem = {
      id: generateUniqueId(),
      type: 'field',
      content: `[${fieldName}]`,
      field: fieldName,
    };

    setTemplate([...template, newItem]);

    // Focus the textarea after adding a field
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);

    toast({
      title: 'Field added',
      description: `Added ${fieldName} to the template`,
      duration: 1500,
    });
  };

  // Add static text to the template
  const addText = () => {
    if (!textInput.trim()) return;

    const newItem: TemplateItem = {
      id: generateUniqueId(),
      type: 'text',
      content: textInput,
    };

    setTemplate([...template, newItem]);
    setTextInput('');

    // Focus the textarea after adding text
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // Remove an item from the template
  const removeItem = (id: string) => {
    setTemplate(template.filter((item) => item.id !== id));
  };

  // Handle copying the preview to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(preview);
    toast({
      title: 'Copied to clipboard',
      description: 'Template content has been copied to your clipboard',
      duration: 2000,
    });
  };

  // Handle saving the template (placeholder for future functionality)
  const saveTemplate = () => {
    toast({
      title: 'Template saved',
      description: 'Your template has been saved successfully',
      duration: 2000,
    });
  };

  // Get common fields to show as quick access pills
  const commonFields = Object.keys(fields).filter((field) =>
    ['name', 'description', 'price', 'sku', 'author'].includes(field)
  );

  return (
    <div className='w-full '>
      {/* Template builder section */}
      <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
        <h2 className='text-lg font-medium mb-4'>All Available Fields</h2>

        {/* Quick access fields */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {commonFields.map((fieldName) => (
            <FieldPill
              key={fieldName}
              fieldName={fieldName}
              onClick={() => addField(fieldName)}
            />
          ))}
          <FieldSelector fields={fields} onSelectField={addField} />
        </div>

        <Separator className='my-6' />

        {/* Template items section */}
        <div className='mb-6'>
          <h2 className='text-lg font-medium mb-4'>Template Items</h2>
          {template.length > 0 ? (
            <div className='flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-16'>
              {template.map((item) =>
                item.type === 'field' && item.field ? (
                  <TemplateTag
                    key={item.id}
                    fieldName={item.field}
                    onRemove={() => removeItem(item.id)}
                  />
                ) : (
                  <div
                    key={item.id}
                    className='inline-flex items-center px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-medium group animate-appear'
                  >
                    <span className='truncate max-w-[200px]'>
                      {item.content}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className='ml-1.5 p-0.5 rounded-full hover:bg-gray-300 transition-colors'
                      aria-label='Remove text'
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className='flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500'>
              No items added to the template yet
            </div>
          )}
        </div>

        {/* Add static text input */}
        <div className='flex gap-2 mb-6'>
          <Textarea
            ref={textareaRef}
            placeholder='Add static text...'
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className='min-h-[100px] text-base'
          />
          <div className='flex flex-col'>
            <Button
              onClick={addText}
              disabled={!textInput.trim()}
              className='mb-2'
            >
              Add Text
            </Button>
          </div>
        </div>

        <Separator className='my-6' />

        {/* Preview section */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-medium'>Preview</h2>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-1.5'
                onClick={copyToClipboard}
              >
                <Copy size={14} />
                <span>Copy</span>
              </Button>
              <Button
                variant='default'
                size='sm'
                className='flex items-center gap-1.5'
                onClick={saveTemplate}
              >
                <Save size={14} />
                <span>Save Template</span>
              </Button>
            </div>
          </div>
          <div className='template-textarea overflow-y-auto whitespace-pre-wrap'>
            {preview ? (
              <div
                dangerouslySetInnerHTML={{ __html: preview }}
                className=''
              ></div>
            ) : (
              <span className='text-gray-400'>
                Template preview will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionTemplate;
