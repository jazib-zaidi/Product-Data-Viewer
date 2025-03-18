export interface ProductData {
  id: number;
  sku: string;
  name: string;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  weight: number;
  extension_attributes: {
    stock_item: {
      qty: number;
      is_in_stock: boolean;
    };
  };
  media_gallery_entries: Array<{
    media_type: string;
    file: string;
  }>;
  custom_attributes: Array<{
    attribute_code: string;
    value: string;
  }>;
}