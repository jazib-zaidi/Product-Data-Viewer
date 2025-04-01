import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  ShoppingCart,
  LayoutGrid,
  ArrowRight,
  CircleCheck,
  Store,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';

const PlatformSelector = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const platforms = [
    {
      id: 'shopify',
      name: 'Shopify',
      description:
        'Connect to your Shopify store and analyze sales, customers, and products.',
      icon: (
        <img
          style={{ width: 60 }}
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6zpvhC0euHbpxlVe45p1ZaKZgX2GEyOe-WyrmsdyMe9MNvgDJdqsFnZ3LDeQ_9W8aD48&usqp=CAU'
          alt=''
        />
      ),

      textColor: 'text-[#95BF47]',
      route: '/shopify',
      comingSoon: false,
    },
    {
      id: 'magento',
      name: 'Magento',
      description:
        'Connect to your Magento store and get insights into your e-commerce performance.',
      icon: (
        <img
          style={{ width: 60 }}
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMBJNzsK_4piwB2GArtqWbNxaBbyknPa2CLodk8Gm4xvxeX7nodMlDZB8us_78vTNhs_0&usqp=CAU'
          alt=''
        />
      ),
      textColor: 'text-[#F26322]',
      route: '/magento',
      comingSoon: false,
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      description:
        'Connect to your BigCommerce store and analyze your e-commerce metrics.',
      icon: <Store className='h-6 w-6' />,
      color: 'bg-[#34313F]',
      textColor: 'text-[#34313F]',
      route: '/bigcommerce',
      comingSoon: true,
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description:
        'Connect to your WooCommerce store and visualize your WordPress shop data.',
      icon: <ShoppingBag className='h-6 w-6' />,
      color: 'bg-[#96588A]',
      textColor: 'text-[#96588A]',
      route: '/woocommerce',
      comingSoon: true,
    },
  ];

  const renderPlatformCard = (platform) => {
    if (platform.comingSoon) {
      return (
        <div
          key={platform.id}
          className='block'
          onMouseEnter={() => setHoveredPlatform(platform.id)}
          onMouseLeave={() => setHoveredPlatform(null)}
        >
          <Card
            className={`
            h-full overflow-hidden transition-all duration-300 relative
            ${
              hoveredPlatform === platform.id ? 'shadow-lg scale-105' : 'shadow'
            }
            opacity-80
          `}
          >
            <div className='p-6 flex flex-col h-full'>
              <div
                className={`${platform.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white`}
              >
                {platform.icon}
              </div>

              <h3 className={`text-2xl font-bold mb-2 ${platform.textColor}`}>
                {platform.name}
              </h3>

              <p className='text-muted-foreground mb-6 flex-grow'>
                {platform.description}
              </p>

              <div className='flex items-center mt-auto font-medium text-muted-foreground'>
                Coming Soon
              </div>

              <div className='absolute top-0 right-0 bg-muted/60 text-muted-foreground py-1 px-3 rounded-bl-lg text-sm font-medium'>
                Coming Soon
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <Link
        key={platform.id}
        to={platform.route}
        className='block'
        onMouseEnter={() => setHoveredPlatform(platform.id)}
        onMouseLeave={() => setHoveredPlatform(null)}
      >
        <Card
          className={`
          h-full overflow-hidden transition-all duration-300 
          ${hoveredPlatform === platform.id ? 'shadow-lg scale-105' : 'shadow'}
          hover:border-${platform.textColor} group relative
        `}
        >
          <div className='p-6 flex flex-col h-full'>
            <div
              className={`${platform.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white`}
            >
              {platform.icon}
            </div>

            <h3 className={`text-2xl font-bold mb-2 ${platform.textColor}`}>
              {platform.name}
            </h3>

            <p className='text-muted-foreground mb-6 flex-grow'>
              {platform.description}
            </p>

            <div
              className={`
              flex items-center mt-auto font-medium ${platform.textColor}
              transition-all duration-300
              ${hoveredPlatform === platform.id ? 'translate-x-2' : ''}
            `}
            >
              Connect
              <ArrowRight className='ml-2 h-4 w-4' />
            </div>

            {hoveredPlatform === platform.id && (
              <div
                className={`absolute top-4 right-4 ${platform.color} rounded-full p-1 text-white animate-fade-in`}
              >
                <CircleCheck className='h-5 w-5' />
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
      {platforms.map((platform) => renderPlatformCard(platform))}
    </div>
  );
};

export default PlatformSelector;
