import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductDataDisplay({ product }) {
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    images: true,
    description: true,
    categories: true,
    attributes: true,
    variants: true,
    custom: true,
    warranty: true,
    related: true,
  });

  if (!product) {
    return <div className='p-8 text-center'>Product data not found</div>;
  }

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Parse description HTML content
  const createMarkup = (html) => {
    console.log(html);
    return { __dangerouslySetInnerHTML: { __html: html } };
  };

  // Creates a section with toggle functionality
  const Section = ({ title, id, children }) => (
    <div className='border border-gray-200 rounded-lg mb-6 overflow-hidden'>
      <button
        onClick={() => toggleSection(id)}
        className='w-full bg-gray-50 p-4 text-left flex justify-between items-center'
      >
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        {expandedSections[id] ? (
          <ChevronUp className='h-5 w-5 text-gray-500' />
        ) : (
          <ChevronDown className='h-5 w-5 text-gray-500' />
        )}
      </button>

      {expandedSections[id] && <div className='p-4 bg-white'>{children}</div>}
    </div>
  );

  // Display a single data field
  const DataField = ({ label, value, className = '' }) => (
    <div className={`mb-2 ${className}`}>
      <span className='font-semibold text-gray-700'>{label}: </span>
      <span className='text-gray-800'>{value || 'N/A'}</span>
    </div>
  );

  // Format price with commas and two decimal places
  const formatPrice = (price) => {
    if (price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>
          Product Data: {product.name}
        </h1>

        {/* Basic Information */}
        <Section title='Product Images' id='images'>
          {product.images.length > 0 ? (
            <div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className='border border-gray-200 rounded overflow-hidden flex flex-col'
                  >
                    <div className='aspect-square bg-gray-100 overflow-hidden'>
                      <img
                        src={image.url_standard}
                        alt={image.description || product.name}
                        className='w-full h-full object-contain'
                      />
                    </div>
                    <div className='p-2 bg-white text-sm'>
                      <p className='font-medium text-gray-900'>
                        {image.description || 'No description'}
                      </p>
                      <p className='text-gray-500 text-xs'>
                        ID: {image.id} | Sort: {image.sort_order}
                      </p>
                      <p className='text-gray-500 text-xs truncate'>
                        File: {image.image_file}
                      </p>
                      <p className='text-gray-500 text-xs'>
                        {image.is_thumbnail ? 'Primary Thumbnail' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='text-sm text-gray-500'>
                Total Images: {product.images.length}
              </div>
            </div>
          ) : (
            <p className='text-gray-500'>No images available</p>
          )}
        </Section>
        <Section title='Basic Information' id='basics'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <DataField label='ID' value={product.id} />
              <DataField label='Name' value={product.name} />
              <DataField label='Type' value={product.type} />
              <DataField label='SKU' value={product.sku} />
              <DataField label='UPC' value={product.upc} />
              <DataField label='MPN' value={product.mpn} />
              <DataField label='GTIN' value={product.gtin} />
              <DataField label='Brand' value={product.brand?.name} />
              <DataField label='Condition' value={product.condition} />
              <DataField label='Weight' value={`${product.weight} lbs`} />
              {product.width > 0 && (
                <DataField label='Width' value={`${product.width} in`} />
              )}
              {product.height > 0 && (
                <DataField label='Height' value={`${product.height} in`} />
              )}
              {product.depth > 0 && (
                <DataField label='Depth' value={`${product.depth} in`} />
              )}
            </div>
            <div>
              <DataField label='Price' value={formatPrice(product.price)} />
              <DataField
                label='Cost Price'
                value={formatPrice(product.cost_price)}
              />
              <DataField
                label='Retail Price'
                value={formatPrice(product.retail_price)}
              />
              <DataField
                label='Sale Price'
                value={formatPrice(product.sale_price)}
              />
              <DataField
                label='Calculated Price'
                value={formatPrice(product.calculated_price)}
              />
              <DataField
                label='MAP Price'
                value={formatPrice(product.map_price)}
              />
              <DataField
                label='Free Shipping'
                value={product.is_free_shipping ? 'Yes' : 'No'}
              />
              <DataField
                label='Visible'
                value={product.is_visible ? 'Yes' : 'No'}
              />
              <DataField
                label='Featured'
                value={product.is_featured ? 'Yes' : 'No'}
              />
              <DataField
                label='Inventory Level'
                value={product.inventory_level}
              />
              <DataField
                label='Inventory Warning Level'
                value={product.inventory_warning_level}
              />
              <DataField
                label='Inventory Tracking'
                value={product.inventory_tracking || 'None'}
              />
              <DataField label='Total Sold' value={product.total_sold} />
              <DataField label='View Count' value={product.view_count} />
            </div>
          </div>
          <div className='mt-4 border-t border-gray-100 pt-4'>
            <DataField
              label='Date Created'
              value={formatDate(product.date_created)}
            />
            <DataField
              label='Date Modified'
              value={formatDate(product.date_modified)}
            />
            <DataField
              label='Date Last Imported'
              value={formatDate(product.date_last_imported)}
            />
            <DataField label='Custom URL' value={product.custom_url?.url} />
          </div>
        </Section>

        {/* Images */}

        {/* Description */}
        <Section title='Product Description' id='description'>
          <div
            className='prose prose-blue max-w-none'
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </Section>

        {/* Categories */}
        <Section title='Categories' id='categories'>
          {product.categories.length > 0 ? (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    URL
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Parent ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Sort Order
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {product.categories.map((category) => (
                  <tr key={category.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {category.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {category.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-600'>
                      {category.custom_url.url}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {category.parent_id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {category.sort_order}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-gray-500'>No categories assigned</p>
          )}
        </Section>

        {/* Attributes */}
        <Section title='Attributes & Metadata' id='attributes'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-semibold text-gray-800 mb-2'>
                Search and SEO
              </h3>
              <DataField label='Page Title' value={product.page_title} />
              <DataField
                label='Meta Description'
                value={product.meta_description}
              />
              <DataField
                label='Search Keywords'
                value={product.search_keywords}
              />

              {product.meta_keywords?.length > 0 && (
                <div className='mb-2'>
                  <span className='font-semibold text-gray-700'>
                    Meta Keywords:{' '}
                  </span>
                  <div className='flex flex-wrap mt-1'>
                    {product.meta_keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className='bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2'
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className='font-semibold text-gray-800 mb-2'>Open Graph</h3>
              <DataField label='Type' value={product.open_graph_type} />
              <DataField label='Title' value={product.open_graph_title} />
              <DataField
                label='Description'
                value={product.open_graph_description}
              />
              <DataField
                label='Use Meta Description'
                value={product.open_graph_use_meta_description ? 'Yes' : 'No'}
              />
              <DataField
                label='Use Product Name'
                value={product.open_graph_use_product_name ? 'Yes' : 'No'}
              />
              <DataField
                label='Use Image'
                value={product.open_graph_use_image ? 'Yes' : 'No'}
              />
            </div>
          </div>

          <div className='mt-6'>
            <h3 className='font-semibold text-gray-800 mb-2'>
              Additional Settings
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <DataField label='Sort Order' value={product.sort_order} />
              <DataField label='Tax Class ID' value={product.tax_class_id} />
              <DataField
                label='Product Tax Code'
                value={product.product_tax_code}
              />
              <DataField label='Option Set ID' value={product.option_set_id} />
              <DataField
                label='Option Set Display'
                value={product.option_set_display}
              />
              <DataField label='Layout File' value={product.layout_file} />
              <DataField
                label='Bin Picking Number'
                value={product.bin_picking_number}
              />
              <DataField label='Reviews Count' value={product.reviews_count} />
              <DataField
                label='Reviews Rating Sum'
                value={product.reviews_rating_sum}
              />
              <DataField
                label='Order Quantity Minimum'
                value={product.order_quantity_minimum}
              />
              <DataField
                label='Order Quantity Maximum'
                value={product.order_quantity_maximum}
              />
              <DataField
                label='Fixed Cost Shipping Price'
                value={formatPrice(product.fixed_cost_shipping_price)}
              />
              <DataField label='Availability' value={product.availability} />
              <DataField
                label='Availability Description'
                value={product.availability_description}
              />
              <DataField
                label='Gift Wrapping Options Type'
                value={product.gift_wrapping_options_type}
              />
              <DataField
                label='Is Price Hidden'
                value={product.is_price_hidden ? 'Yes' : 'No'}
              />
              <DataField
                label='Price Hidden Label'
                value={product.price_hidden_label}
              />
              <DataField
                label='Is Condition Shown'
                value={product.is_condition_shown ? 'Yes' : 'No'}
              />
            </div>
          </div>
        </Section>

        {/* Variants */}
        <Section title='Variants' id='variants'>
          {product.variants?.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      SKU
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Weight
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Inventory
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {product.variants.map((variant) => (
                    <tr key={variant.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {variant.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {variant.sku}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatPrice(variant.price)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {variant.weight} lbs
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {variant.inventory_level}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {variant.option_values?.length > 0
                          ? variant.option_values
                              .map((opt) => opt.label)
                              .join(', ')
                          : 'No options'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-gray-500'>No variants available</p>
          )}
        </Section>

        {/* Custom Fields */}
        <Section title='Custom Fields' id='custom'>
          {product.custom_fields?.length > 0 ? (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {product.custom_fields.map((field) => (
                  <tr key={field.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {field.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {field.name}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {field.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-gray-500'>No custom fields available</p>
          )}
        </Section>

        {/* Warranty */}
        {product.warranty && (
          <Section title='Warranty Information' id='warranty'>
            <div className='prose prose-blue max-w-none'>
              <p className='whitespace-pre-wrap'>{product.warranty}</p>
            </div>
          </Section>
        )}

        {/* Related Products */}
        {product.related_products?.length > 0 && (
          <Section title='Related Products' id='related'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {product.related_products.map((id) => (
                <div
                  key={id}
                  className='bg-white border border-gray-200 rounded-lg p-4 text-center'
                >
                  <span className='text-2xl font-semibold text-gray-700'>
                    {id}
                  </span>
                  <p className='text-xs text-gray-500 mt-1'>Product ID</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
