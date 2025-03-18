
export type DataField = {
  attribute_code: string;
  value: string;
};

export type TemplateItem = {
  id: string;
  type: 'field' | 'text';
  content: string;
  field?: string;
};

export type ProductData = {
  id: number;
  sku: string;
  name: string;
  price: number;
  custom_attributes: DataField[];
  [key: string]: any;
};
