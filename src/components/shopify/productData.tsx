import { useRef, useState } from 'react';
import { handleDownload } from '../../utils/pdfDownload';

export default function ProductDisplay({ domain, productData }) {
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const hasData = Boolean(productData?.data?.product?.id);
  const product = hasData ? productData.data.product : null;

  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants?.[0]?.id || null
  );

  const selectedVariant = product?.variants?.find(
    (variant) => variant.id === selectedVariantId
  );

  if (!hasData) {
    return (
      <div className=''>
        <div className='bg-white rounded-lg shadow-md p-8 text-center'>
          <svg
            className='w-16 h-16 mx-auto text-gray-400 mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z'
            ></path>
          </svg>
          <h2 className='text-2xl font-bold text-gray-700 mb-2'>
            No Product Data Available
          </h2>
          <p className='text-gray-500 mb-4'>
            Please check that you're passing valid product data to this
            component.
          </p>
          <div className='bg-gray-50 p-4 rounded-lg text-left'>
            <p className='text-sm font-medium text-gray-700 mb-2'>
              Example data structure:
            </p>
            <pre className='bg-gray-100 p-3 rounded text-xs overflow-auto'>
              {`{
  "status": "success",
  "data": [
    {
      "id": 123456789,
      "title": "Product Title",
      "variants": [...],
      ...
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const renderRichTextContent = (richTextValue) => {
    try {
      if (typeof richTextValue !== 'string') return richTextValue;

      const parsedContent = JSON.parse(richTextValue);

      if (
        parsedContent.type === 'root' &&
        Array.isArray(parsedContent.children)
      ) {
        let html = '';

        const processNode = (node) => {
          if (node.type === 'paragraph') {
            return `<p>${node.children.map(processNode).join('')}</p>`;
          } else if (node.type === 'text') {
            return node.value;
          } else if (node.type === 'link') {
            return `<a href="${
              node.url
            }" target="_blank" rel="noopener noreferrer">${node.children
              .map(processNode)
              .join('')}</a>`;
          } else if (node.type === 'list') {
            const tag = node.listType === 'ordered' ? 'ol' : 'ul';
            return `<${tag}>${node.children
              .map(processNode)
              .join('')}</${tag}>`;
          } else if (node.type === 'list-item') {
            return `<li>${node.children.map(processNode).join('')}</li>`;
          } else if (node.type === 'heading') {
            const hLevel = Math.min(node.level, 6);
            return `<h${hLevel}>${node.children
              .map(processNode)
              .join('')}</h${hLevel}>`;
          } else if (node.children && Array.isArray(node.children)) {
            return node.children.map(processNode).join('');
          }
          return '';
        };

        html = parsedContent.children.map(processNode).join('');
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      }

      if (
        parsedContent.value &&
        parsedContent.scale_min &&
        parsedContent.scale_max
      ) {
        return (
          <div className='flex items-center'>
            <span className='font-medium'>{parsedContent.value}</span>
            <span className='mx-1'>out of</span>
            <span>{parsedContent.scale_max}</span>
          </div>
        );
      }

      return (
        <pre className='text-xs whitespace-pre-wrap'>
          {JSON.stringify(parsedContent, null, 2)}
        </pre>
      );
    } catch (e) {
      return richTextValue;
    }
  };

  const renderMetafields = (metafields) => {
    if (!metafields || metafields.length === 0) {
      return <p className='text-gray-500 italic'>No metafields available</p>;
    }

    const groupedMetafields = metafields.reduce((acc, metafield) => {
      const namespace = metafield.namespace || 'other';
      if (!acc[namespace]) acc[namespace] = [];
      acc[namespace].push(metafield);
      return acc;
    }, {});

    return (
      <div className='space-y-6'>
        {Object.entries(groupedMetafields).map(([namespace, fields]) => (
          <div
            key={namespace}
            className='border border-gray-200 rounded-lg overflow-hidden'
          >
            <div className='bg-gray-100 px-4 py-2 font-medium text-gray-700 border-b border-gray-200'>
              {namespace.toUpperCase()}
            </div>
            <div className='p-4 space-y-4'>
              {fields.map((metafield) => (
                <div
                  key={metafield.id}
                  className='border border-gray-200 rounded p-4 bg-white'
                >
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='font-medium text-blue-600'>
                      Attribute - {metafield.key}
                    </h3>
                    <span className='text-xs px-2 py-1 bg-gray-100 rounded-full'>
                      {metafield.type}
                    </span>
                  </div>

                  <div className='bg-gray-50 p-3 rounded'>
                    {metafield.type === 'rich_text_field' ? (
                      <div className='rich-text-content'>
                        {renderRichTextContent(metafield.value)}
                      </div>
                    ) : metafield.type === 'rating' ? (
                      <div className='rating-content'>
                        {renderRichTextContent(metafield.value)}
                      </div>
                    ) : metafield.type === 'json' ||
                      metafield.type === 'json_string' ? (
                      <div className='json-content'>
                        {(() => {
                          try {
                            const jsonData = JSON.parse(metafield.value);
                            if (jsonData.rating !== undefined) {
                              return (
                                <div>
                                  <div className='flex items-center mb-2'>
                                    <span className='text-yellow-500 text-lg font-bold'>
                                      {jsonData.rating}
                                    </span>
                                    <span className='text-gray-500 text-sm ml-1'>
                                      / 5
                                    </span>
                                    <span className='text-gray-500 text-sm ml-2'>
                                      ({jsonData.total_reviews} reviews)
                                    </span>
                                  </div>
                                  {jsonData.total_star5 > 0 && (
                                    <div className='flex items-center text-sm'>
                                      <span className='w-12'>5 stars:</span>
                                      <div className='w-32 bg-gray-200 rounded-full h-2 mr-2'>
                                        <div
                                          className='bg-yellow-500 h-2 rounded-full'
                                          style={{
                                            width: `${
                                              (jsonData.total_star5 /
                                                jsonData.total_reviews) *
                                              100
                                            }%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span>{jsonData.total_star5}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            } else if (
                              jsonData.list &&
                              Array.isArray(jsonData.list)
                            ) {
                              return (
                                <div>
                                  <p className='text-sm text-gray-500 mb-2'>
                                    {jsonData.list.length} items in this list
                                  </p>
                                  <button className='text-blue-500 text-sm hover:underline'>
                                    View full data
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <pre className='text-xs whitespace-pre-wrap'>
                                {JSON.stringify(jsonData, null, 2)}
                              </pre>
                            );
                          } catch (e) {
                            return (
                              <div className='text-red-500'>
                                Invalid JSON: {metafield.value}
                              </div>
                            );
                          }
                        })()}
                      </div>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: metafield.value }}
                        className='text-sm'
                      />
                    )}
                  </div>

                  <div className='mt-2 text-xs text-gray-500'>
                    Last updated: {formatDate(metafield.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVariantDetails = (variant) => {
    if (!variant) return null;

    const variantImage = product.images?.find((img) =>
      img.variant_ids?.includes(variant.id)
    );

    return (
      <div className='mt-6 bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-xl font-bold mb-4 text-blue-700'>
          Selected Variant: {variant.title || 'Unnamed Variant'}
        </h3>

        <div className='flex flex-col md:flex-row gap-6'>
          {variantImage && (
            <div className='md:w-1/3'>
              <img
                src={variantImage.src}
                alt={variant.title}
                className='w-full h-auto rounded-md shadow-sm'
              />
            </div>
          )}

          <div className={variantImage ? 'md:w-2/3' : 'w-full'}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='bg-gray-50 p-3 rounded'>
                <p className='text-sm font-medium text-gray-500'>Price</p>
                <p className='text-2xl font-bold text-green-600'>
                  {formatPrice(variant.price)}
                </p>
              </div>

              {variant.compare_at_price && (
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>
                    Compare at Price
                  </p>
                  <p className='text-xl font-medium text-gray-800 line-through'>
                    {formatPrice(variant.compare_at_price)}
                  </p>
                </div>
              )}

              <div className='bg-gray-50 p-3 rounded'>
                <p className='text-sm font-medium text-gray-500'>Inventory</p>
                <p className='text-xl font-medium text-gray-800'>
                  {variant.inventory_quantity || 0} in stock
                </p>
              </div>

              <div className='bg-gray-50 p-3 rounded'>
                <p className='text-sm font-medium text-gray-500'>SKU</p>
                <p className='text-xl font-medium text-gray-800'>
                  {variant.sku || 'N/A'}
                </p>
              </div>
            </div>

            <div className='mt-4'>
              <h4 className='text-lg font-medium mb-2'>Variant Details</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>Created</p>
                  <p className='text-sm text-gray-800'>
                    {formatDate(variant.created_at)}
                  </p>
                </div>
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>Updated</p>
                  <p className='text-sm text-gray-800'>
                    {formatDate(variant.updated_at)}
                  </p>
                </div>
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>Position</p>
                  <p className='text-sm text-gray-800'>
                    {variant.position || 'N/A'}
                  </p>
                </div>
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>Weight</p>
                  <p className='text-sm text-gray-800'>
                    {variant.weight
                      ? `${variant.weight} ${variant.weight_unit || 'kg'}`
                      : 'N/A'}
                  </p>
                </div>
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>
                    Requires Shipping
                  </p>
                  <p className='text-sm text-gray-800'>
                    {variant.requires_shipping ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className='bg-gray-50 p-3 rounded'>
                  <p className='text-sm font-medium text-gray-500'>Taxable</p>
                  <p className='text-sm text-gray-800'>
                    {variant.taxable ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={contentRef} className=''>
      <div className='bg-white rounded-lg shadow-md overflow-hidden mb-6'>
        <div className='relative'>
          {product.image && (
            <img
              src={product.image.src}
              alt={product.title}
              className='w-full h-64 object-cover'
            />
          )}
          <div
            className={`${
              product.image
                ? 'absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'
                : ''
            } flex items-end`}
          >
            <div
              className={`p-6 ${
                product.image ? 'text-white' : 'text-gray-800'
              }`}
            >
              <h1 className='text-3xl font-bold mb-2'>
                Attribute - Title : {product.title || 'Untitled Product'}
              </h1>
              <div className='flex items-center gap-2 mb-2'>
                {product.metafields?.find((mf) => mf.key === 'rating') && (
                  <div className='flex items-center gap-1 bg-yellow-400 px-2 py-1 rounded text-black'>
                    <span className='text-sm font-bold'>
                      {(() => {
                        try {
                          const ratingMeta = product.metafields.find(
                            (mf) => mf.key === 'rating'
                          );
                          const ratingValue =
                            typeof ratingMeta.value === 'string'
                              ? JSON.parse(ratingMeta.value).value
                              : ratingMeta.value?.value;
                          return `${ratingValue || 'N/A'} / 5`;
                        } catch (e) {
                          return 'N/A / 5';
                        }
                      })()}
                    </span>
                    <span className='text-xs'>
                      (
                      {product.metafields?.find(
                        (mf) => mf.key === 'rating_count'
                      )?.value || 0}{' '}
                      reviews)
                    </span>
                  </div>
                )}
                {product.vendor && (
                  <span className='text-sm bg-blue-500 px-2 py-1 rounded text-white'>
                    {product.vendor}
                  </span>
                )}
              </div>
              <p className='text-sm'>
                Created: {formatDate(product.created_at)} | Updated:{' '}
                {formatDate(product.updated_at)}
              </p>
            </div>
          </div>
        </div>

        <div className='p-6'>
          <b>Attribute - body_html :</b>
          {product.body_html ? (
            <div
              className='mb-4 prose max-w-none bg-gray-50 p-3 rounded'
              dangerouslySetInnerHTML={{ __html: product.body_html }}
            />
          ) : (
            <p className='mb-4 text-gray-500 italic'>
              No product description available
            </p>
          )}
          <div className='mb-4'>
            <p className='text-sm text-gray-500'>
              Status:{' '}
              <span className='font-medium text-green-600'>
                {product.status || 'Unknown'}
              </span>
            </p>
            {product.tags && (
              <p className='text-sm  bg-gray-50 p-3'>
                <b>Attribute Tags: </b>
                <span className='text-gray-800 font-medium'>
                  {product.tags}
                </span>
              </p>
            )}
            {product?.product_type && (
              <span className='my-8'>
                <b>Attribute - product_type: </b>{' '}
                <span className=' px-2 py-1 bg-blue-400 rounded-full text-white'>
                  {product.product_type}
                </span>
              </span>
            )}
            <ul>
              {product?.options.length > 0 && (
                <div className='my-4'>
                  {product?.options.map(({ name, values }) => {
                    return (
                      <li className='my-4'>
                        <b>Attribute - {name}</b> :{values}{' '}
                      </li>
                    );
                  })}
                </div>
              )}
            </ul>

            {product?.vendor && (
              <p>
                {' '}
                <b>Attribute Vendor: </b>
                {product?.vendor}{' '}
              </p>
            )}
          </div>
        </div>
      </div>

      {product.variants && product.variants.length > 0 ? (
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-bold mb-4'>Available Variants</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {product.variants.map((variant) => {
              const variantImage = product.images?.find((img) =>
                img.variant_ids?.includes(variant.id)
              );

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`p-4 border rounded-lg transition hover:shadow-md flex flex-col h-full ${
                    selectedVariantId === variant.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {variantImage && (
                    <img
                      src={variantImage.src}
                      alt={variant.title}
                      className='w-full h-32 object-contain mb-3'
                    />
                  )}
                  <div className='flex flex-col flex-grow'>
                    <h3 className='font-bold text-lg mb-1'>
                      {variant.title || 'Unnamed Variant'}
                    </h3>
                    <div className='flex justify-between items-center mt-auto'>
                      <span className='font-bold text-green-600'>
                        {formatPrice(variant.price)}
                      </span>
                      <span className='text-sm text-gray-600'>
                        {variant.inventory_quantity || 0} in stock
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-6 mb-6 text-center'>
          <h2 className='text-xl font-bold mb-2'>No Variants Available</h2>
          <p className='text-gray-500'>
            This product doesn't have any variants.
          </p>
        </div>
      )}

      {renderVariantDetails(selectedVariant)}

      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-bold mb-4'>Product Metafields</h2>
        {renderMetafields(productData?.data?.metafields)}
      </div>
      <button
        onClick={() => handleDownload(contentRef, setLoading, domain)}
        disabled={loading}
        className='sticky bottom-8 left-[10000px] bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition'
      >
        {loading ? 'Downloading...' : 'Download as PDF'}
      </button>

      {product.images && product.images.length > 0 ? (
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>All Product Images</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {product.images.map((image) => (
              <div
                key={image.id}
                className='border border-gray-200 rounded-lg overflow-hidden'
              >
                <img
                  src={image.src}
                  alt={`Product image ${image.position}`}
                  className='w-full h-40 object-contain'
                />
                <div className='p-2 bg-gray-50 text-xs'>
                  <p>Position: {image.position || 'N/A'}</p>
                  <p>
                    Dimensions: {image.width || '?'}x{image.height || '?'}
                  </p>
                  {image.variant_ids && image.variant_ids.length > 0 && (
                    <p>
                      Variant:{' '}
                      {product.variants.find(
                        (v) => v.id === image.variant_ids[0]
                      )?.title || 'Unknown'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-6 text-center'>
          <h2 className='text-xl font-bold mb-2'>No Product Images</h2>
          <p className='text-gray-500'>This product doesn't have any images.</p>
        </div>
      )}
    </div>
  );
}
