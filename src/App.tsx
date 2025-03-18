import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { ProductData } from './types';
import ProductCard from './components/ProductCard';
import DescriptionTemplate from './components/DescriptionTemplate';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function App() {
  const [apiKey, setApiKey] = useState('x1k9qu01e1lvv60sj3kwhqtvs7hle928');
  const [sku, setSku] = useState('9781760126759');
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (sku: string) => {
    try {
      const response = await fetch(
        `https://product-data-viewer-backend.onrender.com/api/products/${sku}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product ${sku}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${sku}:`, error);
      throw error;
    }
  };

  const handleFetchProduct = async () => {
    setIsLoading(true);
    setError(null);
    setProduct(null);

    try {
      const fetchedProduct = await fetchProduct(sku);
      setProduct(fetchedProduct);
    } catch (error) {
      setError(
        'Failed to fetch product. Please check your API key and SKU, then try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const maskedApiKey = apiKey.replace(/./g, '*');

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
          <div className='d-flex flex-col items-center mb-6'>
            <h1 className='text-3xl font-bold mb-6'>
              Magento Product Data Viewer
            </h1>
            (https://www.dymocks.com.au/)
          </div>
          <div className='flex gap-4 items-end mb-6'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                API Key
              </label>
              <input
                type='password'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter your API key'
              />
              <p className='mt-1 text-sm text-gray-500'>
                Current API Key: {maskedApiKey}
              </p>
            </div>

            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Product Id
              </label>
              <input
                type='text'
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter product SKU'
              />
            </div>

            <button
              onClick={handleFetchProduct}
              disabled={isLoading}
              className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 h-[42px]'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Loading...
                </>
              ) : (
                <>
                  <Search className='w-5 h-5' />
                  Fetch Product
                </>
              )}
            </button>
          </div>
          {error && (
            <div className='bg-red-50 text-red-700 p-4 rounded-md mb-6'>
              {error}
            </div>
          )}
        </div>
        <Tabs defaultValue='tab1'>
          <TabsList>
            <TabsTrigger value='tab1'>Product Detail</TabsTrigger>
            <TabsTrigger value='tab2'>Template PlayGround</TabsTrigger>
          </TabsList>

          <TabsContent value='tab1'>
            {product ? (
              <ProductCard product={product} />
            ) : (
              <div className='d-flex justify-content-center align-items-center text-gray-500'>
                <img
                  className='m-auto w-[300px] h-[300px]'
                  src='/7486744.png'
                  alt='Centered Image'
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value='tab2'>
            {product ? (
              <DescriptionTemplate data={product} />
            ) : (
              <div className='d-flex justify-content-center align-items-center text-gray-500'>
                <img
                  className='m-auto w-[300px] h-[300px]'
                  src='/7486744.png'
                  alt='Centered Image'
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <footer className='text-center mt-8 text-sm text-gray-500'>
          {' '}
          Magento Product Data Viewer by feedOps
        </footer>
      </div>
    </div>
  );
}

export default App;
