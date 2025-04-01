import React, { useState, useEffect } from 'react';
import { Package2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import ProductDisplay from './shopify/productData';

interface Product {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  data: {};
  images: { src: string }[];
  variants: {
    edges: { node: { price: string; quantityAvailable: number } }[];
  };
}

function Shopify() {
  const [domain, setDomain] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load store and access token from localStorage when the component mounts
  useEffect(() => {
    const storedDomain = localStorage.getItem('shopify_domain');
    const storedAccessToken = localStorage.getItem('shopify_access_token');
    const product = localStorage.getItem('product_id');

    if (storedDomain && storedAccessToken) {
      setDomain(storedDomain);
      setAccessToken(storedAccessToken);
    }

    if (product) {
      setProductId(product);
    }
  }, []);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://product-data-viewer-backend.onrender.com/api/v1/shopify/product?storeHash=${domain}&accessToken=${accessToken}&productId=${productId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save store and access token to localStorage when they change
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    localStorage.setItem('shopify_domain', value); // Store domain in localStorage
  };

  const handleAccessTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccessToken(value);
    localStorage.setItem('shopify_access_token', value); // Store access token in localStorage
  };

  const handleAccessProductIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setProductId(value);
    localStorage.setItem('product_id', value);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <Link to={'/'}>
          <Button variant='outline' className='mb-4'>
            <ArrowLeft />
            Go Back
          </Button>
        </Link>

        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='flex items-center gap-3 mb-8'>
            <img
              style={{ width: 60 }}
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6zpvhC0euHbpxlVe45p1ZaKZgX2GEyOe-WyrmsdyMe9MNvgDJdqsFnZ3LDeQ_9W8aD48&usqp=CAU'
              alt='Shopify'
            />
            <h1 className='text-3xl font-bold text-gray-900'>
              Shopify Product Viewer
            </h1>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Store Name
              </label>
              <input
                type='text'
                value={domain}
                onChange={handleDomainChange} // Use custom handler
                placeholder='your-store'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              />
              <p className='mt-1 text-sm text-gray-500'>
                Enter your store name without .myshopify.com
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Access Token
              </label>
              <input
                type='password'
                value={accessToken}
                onChange={handleAccessTokenChange} // Use custom handler
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Id
              </label>
              <input
                value={productId}
                onChange={handleAccessProductIdChange} // Use custom handler
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              />
              <p className='mt-1 text-sm text-gray-500'>
                Enter your product id will look look somthing like this
                shopify_CA_4753001349216_32779679334496
              </p>
            </div>
          </div>

          <Button
            onClick={fetchProducts}
            disabled={loading || !domain || !accessToken || !productId}
            size='sm'
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Fetch Products'
            )}
          </Button>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8'>
            {error}
          </div>
        )}

        {/* Display Products */}
        {Boolean(products?.data?.product?.id) ? (
          <ProductDisplay domain={domain} productData={products} />
        ) : (
          <div className='d-flex justify-content-center align-items-center text-gray-500'>
            <img
              className='m-auto w-[300px] h-[300px]'
              src='/7486744.png'
              alt='Centered Image'
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Shopify;
