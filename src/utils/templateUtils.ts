
import { DataField, ProductData } from "@/types/template";

export const extractFields = (data: ProductData): { [key: string]: string } => {
  const fields: { [key: string]: string } = {
    id: data.id.toString(),
    sku: data.sku,
    name: data.name,
    price: data.price.toString(),
  };

  // Add all custom attributes
  data.custom_attributes.forEach((attr: DataField) => {
    fields[attr.attribute_code] = attr.value;
  });

  // Add any other top-level fields
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      fields[key] = value.toString();
    }
  });

  return fields;
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const getFieldDisplayName = (fieldName: string): string => {
  // Convert snake_case or camelCase to Title Case with spaces
  return fieldName
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
