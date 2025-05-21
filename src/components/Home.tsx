import React from 'react';
import Navbar from '@/components/Navbar';
import PlatformSelector from '@/components/PlatformSelector';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Helmet>
        <title>DataBridge - Product Data Viewer</title>
      </Helmet>
      <section className='py-16 md:py-24 bg-muted/30'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center mb-10'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Choose Your Platform
              </h2>
              <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                Connect with your preferred e-commerce platform
              </p>
            </div>
          </div>

          <PlatformSelector />
        </div>
      </section>
    </div>
    // <div className=''>d</div>
  );
};

export default Home;
