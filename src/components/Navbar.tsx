import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BarChart3,
  Store,
  ShoppingBag,
  sho,
} from 'lucide-react';

const Navbar = () => {
  return (
    <nav className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='container flex h-16 items-center justify-between'>
        <Link
          to='/'
          className='flex items-center gap-2 transition-transform hover:scale-105'
        >
          <BarChart3 className='h-6 w-6 text-brand-blue' />
          <span>
            <span className='text-xl font-bold bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent'>
              DataBridge
            </span>{' '}
            <span className='italic text-xs'>by feedOps</span>
          </span>
        </Link>
        <div className='flex items-center gap-4'>
          <Link to='/shopify' className='hidden sm:block'>
            <Button variant='outline' size='sm'>
              Shopify
            </Button>
          </Link>
          <Link to='/magento' className='hidden sm:block'>
            <Button variant='outline' size='sm'>
              Magento
            </Button>
          </Link>
          <div className='hidden sm:flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='opacity-60 cursor-not-allowed'
              disabled
            >
              <Store className='h-4 w-4 mr-1' />
              BigCommerce
              <span className='ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full'>
                Soon
              </span>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='opacity-60 cursor-not-allowed'
              disabled
            >
              <ShoppingBag className='h-4 w-4 mr-1' />
              WooCommerce
              <span className='ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full'>
                Soon
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
