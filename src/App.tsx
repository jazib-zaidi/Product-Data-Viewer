import React from 'react';

import Magento from './components/Megento';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Shopify from './components/Shopify';
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/magento' element={<Magento />} />
        <Route path='/shopify' element={<Shopify />} />
      </Routes>
      <footer className='border-t py-6 md:py-8'>
        <div className='container flex flex-col items-center justify-center gap-4 text-center md:gap-8'>
          <div className='flex items-center gap-2'>
            {/* <BarChart3 className='h-6 w-6 text-brand-blue' /> */}
            <span className='text-xl font-bold text-brand-navy'>
              DataBridge
            </span>
          </div>
          <p className='text-sm text-muted-foreground'>
            {/* &copy; {new Date().getFullYear()} DataBridge. All rights reserved. */}
          </p>
        </div>
      </footer>
    </BrowserRouter>
  );
};

export default App;
