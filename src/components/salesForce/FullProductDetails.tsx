import React from 'react';
import { useRef, useState } from 'react';
import { handleDownload } from '../../utils/pdfDownload';

const FullProductDetails = ({ product, domain }) => {
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const renderValue = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <div className='ml-4 space-y-2 '>
          {value.map((item, idx) => (
            <div key={idx} className='bg-gray-100 p-2 rounded border'>
              {typeof item === 'object' ? (
                <div className='space-y-1'>
                  {Object.entries(item).map(([k, v]) => (
                    <p key={k} className='text-sm'>
                      <strong className='capitalize'>{k}:</strong>{' '}
                      {JSON.stringify(v)}
                    </p>
                  ))}
                </div>
              ) : (
                <div className=''>
                  <p dangerouslySetInnerHTML={{ __html: item }}></p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className='ml-4 space-y-1'>
          {Object.entries(value).map(([k, v]) => (
            <p key={k} className='text-sm'>
              <strong className='capitalize'>{k}:</strong> {JSON.stringify(v)}
            </p>
          ))}
        </div>
      );
    } else {
      return (
        <div className=''>
          <span
            className='text-gray-700'
            dangerouslySetInnerHTML={{ __html: value }}
          >
            {}
          </span>
        </div>
      );
    }
  };

  const renderImages = () => {
    const allImages =
      product.image_groups?.flatMap(
        (group) =>
          group.images?.map((img) => ({
            ...img,
            groupType: group.view_type,
          })) || []
      ) || [];

    if (allImages.length === 0) return null;

    return (
      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-4'>Product Gallery</h2>
        <div className='flex flex-wrap gap-4'>
          {allImages.map((img, index) => {
            if (img.groupType == 'PDFImage' || img.groupType == 'swatch') {
              return null;
            }
            return (
              <div key={index} className='text-center'>
                <img
                  src={img.link}
                  alt={img.alt || img.title || 'Image'}
                  className='w-32 h-32 object-cover border rounded'
                />
                <p className='text-xs text-gray-600 mt-1'>{img.groupType}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const getMainImage = () => {
    return (
      product.image_groups?.find((group) => group.view_type === 'hi-res')
        ?.images?.[0]?.link ||
      product.image_groups?.[0]?.images?.[0]?.link ||
      'https://via.placeholder.com/300x300.png?text=No+Image'
    );
  };

  const excludedKeys = ['image_groups', 'price', 'currency', 'id', 'name'];

  return (
    <div ref={contentRef} className=' mx-auto'>
      <div className='flex flex-col md:flex-row items-start gap-6 mb-10 bg-white  rounded shadow border p-4'>
        {getMainImage() && (
          <img
            src={getMainImage()}
            alt={product.name || 'Product Image'}
            className='w-64 h-64 object-cover rounded '
          />
        )}

        <div>
          <h1 className='text-3xl font-bold mb-2'>
            Title - {product.name || 'Product Details'}
          </h1>
          {product.id && <p className='text-gray-600 text-lg'>{product.id}</p>}
          {product.price && (
            <p className='text-xl font-semibold mt-2 text-green-700'>
              {product.currency || ''} {product.price}
            </p>
          )}
          <b>Long Description - </b>
          <span
            dangerouslySetInnerHTML={{ __html: product?.long_description }}
          ></span>
        </div>
      </div>

      <section className='mb-10 bg-white p-4'>
        <h2 className='text-2xl font-semibold mb-4'>Product Information</h2>
        <div className='space-y-4'>
          {Object.entries(product).map(([key, value]) => {
            if (excludedKeys.includes(key)) return null;
            return (
              <div key={key} className='bg-gray-100 p-2 rounded border'>
                <h3 className='capitalize font-bold  mb-4 text-blue-700'>
                  Attribute - {key.replace(/_/g, ' ')}:
                </h3>{' '}
                {renderValue(key, value)}
              </div>
            );
          })}
        </div>
      </section>
      {!loading && (
        <button
          onClick={() => handleDownload(contentRef, setLoading, domain)}
          disabled={loading}
          className='sticky bottom-8 left-[10000px] bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition'
        >
          {loading ? 'Downloading...' : 'Download as PDF'}
        </button>
      )}

      {renderImages()}
    </div>
  );
};

export default FullProductDetails;
