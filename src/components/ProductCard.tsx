import React from 'react';
import { ProductData } from '../types';

interface ProductCardProps {
  product: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div
      id='data-view'
      className='bg-white rounded-lg shadow-lg overflow-hidden'
    >
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-6'>Title : {product.name}</h2>

        <div className='space-y-6'>
          <div className='border-b pb-4'>
            <h3 className='text-lg font-semibold mb-3'>Basic Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='font-medium'>ID:</span> {product.id}
              </div>
              <div>
                <span className='font-medium'>SKU:</span> {product.sku}
              </div>
              <div>
                <span className='font-medium'>Price:</span> ${product.price}
              </div>
              <div>
                <span className='font-medium'>Status:</span> {product.status}
              </div>
              <div>
                <span className='font-medium'>Visibility:</span>{' '}
                {product.visibility}
              </div>
              <div>
                <span className='font-medium'>Type ID:</span> {product.type_id}
              </div>
              <div>
                <span className='font-medium'>Created At:</span>{' '}
                {product.created_at}
              </div>
              <div>
                <span className='font-medium'>Updated At:</span>{' '}
                {product.updated_at}
              </div>
              <div>
                <span className='font-medium'>Weight:</span> {product.weight}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className='border-b pb-4'>
            <h3 className='text-lg font-semibold mb-3'>Stock Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              {Object.entries(product.extension_attributes.stock_item).map(
                ([key, value]) => (
                  <div key={key}>
                    <span className='font-medium'>{key}:</span>{' '}
                    {value?.toString()}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Media Gallery */}
          <div className='border-b pb-4'>
            <h3 className='text-lg font-semibold mb-3'>Media Gallery</h3>
            {product.media_gallery_entries.map((entry, index) => (
              <div key={index} className='grid grid-cols-2 gap-4'>
                {Object.entries(entry).map(([key, value]) => (
                  <div key={key}>
                    <span className='font-medium'>{key}:</span>{' '}
                    {Array.isArray(value)
                      ? value.join(', ')
                      : value?.toString() || 'null'}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Custom Attributes */}
          <div>
            <h3 className='text-lg font-semibold mb-3'>Custom Attributes</h3>
            <div className='space-y-4'>
              {product.custom_attributes.map((attr, index) => (
                <div key={index} className='border-b pb-4'>
                  <div className='font-medium text-blue-600'>
                    {attr.attribute_code}
                  </div>
                  <div className='mt-1 whitespace-pre-wrap'>{attr.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
