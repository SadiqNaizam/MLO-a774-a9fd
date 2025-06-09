import React from 'react';
import SiteNavigationMenu from '@/components/layout/SiteNavigationMenu';
import Footer from '@/components/layout/Footer';
import Carousel from '@/components/Carousel'; // Custom Carousel
import CompactProductCard from '@/components/CompactProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const placeholderSlides = [
  {
    id: 1,
    altText: "Summer Collection Launch",
    content: (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-white relative">
        <img src="https://source.unsplash.com/random/1600x900?fashion,summer" alt="Summer Collection" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center p-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Summer Vibes</h2>
          <p className="text-lg md:text-xl mb-6">Explore our new summer collection.</p>
          <Button size="lg" asChild><Link to="/products?category=summer">Shop Now</Link></Button>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    altText: "Tech Gadgets Sale",
    content: (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-white relative">
        <img src="https://source.unsplash.com/random/1600x900?technology,gadgets" alt="Tech Sale" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center p-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Tech Deals</h2>
          <p className="text-lg md:text-xl mb-6">Up to 30% off on latest gadgets.</p>
          <Button size="lg" variant="secondary" asChild><Link to="/products?category=electronics">Explore Deals</Link></Button>
        </div>
      </div>
    ),
  },
];

const placeholderProducts = [
  { id: 'prod1', name: 'Modern Wireless Headphones', price: 199.99, imageUrl: 'https://source.unsplash.com/random/400x533?headphones', productUrl: '/product-detail/prod1', rating: 4.5, reviewCount: 120, tags: ['New', 'Popular'] },
  { id: 'prod2', name: 'Smart Fitness Tracker', price: 89.50, imageUrl: 'https://source.unsplash.com/random/400x533?smartwatch', productUrl: '/product-detail/prod2', rating: 4.2, reviewCount: 95, tags: ['Best Seller'] },
  { id: 'prod3', name: 'Ergonomic Office Chair', price: 299.00, imageUrl: 'https://source.unsplash.com/random/400x533?office,chair', productUrl: '/product-detail/prod3', rating: 4.8, reviewCount: 210 },
  { id: 'prod4', name: 'Portable Bluetooth Speaker', price: 59.99, imageUrl: 'https://source.unsplash.com/random/400x533?speaker', productUrl: '/product-detail/prod4', rating: 4.0, reviewCount: 75, tags: ['Sale'] },
];

const Homepage: React.FC = () => {
  console.log('Homepage loaded');

  const handleAddToCart = (productId: string | number) => {
    console.log(`Homepage: Adding product ${productId} to cart`);
    // Add to cart logic here, e.g., update global state, show toast
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteNavigationMenu siteTitle="EcomStore" cartItemCount={0} />
      <main className="flex-grow">
        <section className="mb-12 md:mb-16">
          <Carousel slides={placeholderSlides} options={{ loop: true }} autoplayOptions={{ delay: 5000 }} />
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Featured Products</h2>
            <p className="text-center text-muted-foreground mb-10">Check out our handpicked selection of popular items.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {placeholderProducts.map(product => (
                <CompactProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Shop With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              We offer high-quality products, fast shipping, and excellent customer service. Discover the difference.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="p-6 border rounded-lg bg-card">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Quality Guaranteed</h3>
                    <p className="text-sm text-muted-foreground">Only the best materials and craftsmanship.</p>
                </div>
                 <div className="p-6 border rounded-lg bg-card">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Fast Shipping</h3>
                    <p className="text-sm text-muted-foreground">Get your orders delivered quickly and reliably.</p>
                </div>
                 <div className="p-6 border rounded-lg bg-card">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Support 24/7</h3>
                    <p className="text-sm text-muted-foreground">Our team is here to help you anytime.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;