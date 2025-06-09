import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SiteNavigationMenu from '@/components/layout/SiteNavigationMenu';
import Footer from '@/components/layout/Footer';
import ProductImageGallery from '@/components/ProductImageGallery';
import ColorSwatchSelector from '@/components/ColorSwatchSelector';
import VariantOptionPills from '@/components/VariantOptionPills';
import ReviewSnapshot from '@/components/ReviewSnapshot';
import CompactProductCard from '@/components/CompactProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ShoppingCart, Star } from 'lucide-react';

// Mock data for a single product
const sampleProduct = {
  id: 'prod123',
  name: 'Premium Noise-Cancelling Over-Ear Headphones',
  category: 'Electronics',
  categoryLink: '/products?category=electronics',
  price: 249.99,
  originalPrice: 299.99,
  description: "Experience immersive sound with our premium noise-cancelling headphones. Crafted for comfort and engineered for audio perfection, these headphones feature plush earcups, intuitive controls, and long-lasting battery life. Perfect for travel, work, or just enjoying your favorite music.",
  specifications: [
    { label: 'Connectivity', value: 'Bluetooth 5.2, AUX' },
    { label: 'Battery Life', value: 'Up to 30 hours' },
    { label: 'Driver Size', value: '40mm Dynamic Drivers' },
    { label: 'Weight', value: '250g' },
    { label: 'Warranty', value: '2 Years Limited' },
  ],
  images: [
    { id: 'img1', src: 'https://source.unsplash.com/random/800x800?headphones,black', alt: 'Headphones front view' },
    { id: 'img2', src: 'https://source.unsplash.com/random/800x800?headphones,side', alt: 'Headphones side view' },
    { id: 'img3', src: 'https://source.unsplash.com/random/800x800?headphones,earcup', alt: 'Headphones earcup detail' },
    { id: 'img4', src: 'https://source.unsplash.com/random/800x800?headphones,lifestyle', alt: 'Headphones in use' },
  ],
  colors: [
    { id: 'color_black', name: 'Midnight Black', hexValue: '#1a1a1a', isAvailable: true },
    { id: 'color_silver', name: 'Lunar Silver', hexValue: '#c0c0c0', isAvailable: true },
    { id: 'color_blue', name: 'Ocean Blue', hexValue: '#0077b6', isAvailable: false },
  ],
  sizes: [ // Example if applicable, or other variants
    { id: 'size_std', label: 'Standard Fit', isAvailable: true },
    { id: 'variant_pro', label: 'Pro Model (+ $50)', isAvailable: true },
  ],
  reviews: {
    averageRating: 4.7,
    reviewCount: 258,
    items: [
        { id: 1, author: 'Alice M.', rating: 5, comment: "Absolutely love these! The sound quality is phenomenal and they are so comfortable.", date: "2023-10-15"},
        { id: 2, author: 'Bob K.', rating: 4, comment: "Great headphones, noise cancellation works well. Battery life is impressive.", date: "2023-10-12"},
        { id: 3, author: 'Clara G.', rating: 5, comment: "Best purchase I've made this year. Worth every penny.", date: "2023-09-28"},
    ]
  },
  stockStatus: 'In Stock',
};

const relatedProducts = [
  { id: 'related1', name: 'Compact In-Ear Buds', price: 79.99, imageUrl: 'https://source.unsplash.com/random/400x533?earbuds', productUrl: '/product-detail/related1', rating: 4.3, reviewCount: 90 },
  { id: 'related2', name: 'Portable DAC/Amp', price: 129.00, imageUrl: 'https://source.unsplash.com/random/400x533?audio,gadget', productUrl: '/product-detail/related2', rating: 4.6, reviewCount: 55 },
  { id: 'related3', name: 'Headphone Stand', price: 29.99, imageUrl: 'https://source.unsplash.com/random/400x533?headphone,stand', productUrl: '/product-detail/related3', rating: 4.9, reviewCount: 150 },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Product ID from URL
  console.log(`ProductDetailPage loaded for product ID: ${id}`);
  // In a real app, fetch product data based on id
  const product = sampleProduct; // Using sample data

  const [selectedColorId, setSelectedColorId] = useState<string | number | null>(product.colors.find(c => c.isAvailable)?.id || null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | number | null>(product.sizes.find(v => v.isAvailable)?.id || null);
  const [reviewText, setReviewText] = useState('');

  const handleAddToCart = () => {
    console.log(`Adding to cart: ${product.name}, Color: ${selectedColorId}, Variant: ${selectedVariantId}`);
    // Add to cart logic (e.g., update global state, show toast)
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting review for ${product.name}: ${reviewText}`);
    setReviewText('');
    // Submit review logic
  };

  if (!product) {
    return <div>Loading product details...</div>; // Or a 404 component
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteNavigationMenu siteTitle="EcomStore" cartItemCount={1} /> {/* Example cart count */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to={product.categoryLink}>{product.category}</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div>
            <ProductImageGallery images={product.images} mainImageRatio={1} />
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>

            <div className="flex items-center justify-between">
              <ReviewSnapshot
                averageRating={product.reviews.averageRating}
                reviewCount={product.reviews.reviewCount}
                onReviewsClick={() => document.getElementById('reviews-accordion')?.scrollIntoView({behavior: 'smooth'})}
              />
              <Badge variant={product.stockStatus === 'In Stock' ? 'default' : 'destructive'}>{product.stockStatus}</Badge>
            </div>

            <div>
              <Label htmlFor="price" className="sr-only">Price</Label>
              <p id="price" className="text-3xl font-semibold text-primary">
                ${product.price.toFixed(2)}
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </p>
            </div>
            
            {product.colors.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Color: {product.colors.find(c => c.id === selectedColorId)?.name}</Label>
                <ColorSwatchSelector
                  options={product.colors}
                  selectedColorId={selectedColorId}
                  onColorSelect={setSelectedColorId}
                />
              </div>
            )}

            {product.sizes.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  {product.sizes[0].label.includes("Fit") ? "Fit" : "Option"}: {product.sizes.find(s => s.id === selectedVariantId)?.label}
                </Label>
                <VariantOptionPills
                  options={product.sizes}
                  selectedOptionId={selectedVariantId}
                  onOptionSelect={setSelectedVariantId}
                  variantGroupName="Size"
                />
              </div>
            )}

            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stockStatus !== 'In Stock'}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            <Accordion type="single" collapsible defaultValue="description" className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Product Description</AccordionTrigger>
                <AccordionContent className="text-muted-foreground prose prose-sm max-w-none">
                  <p>{product.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="specifications">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {product.specifications.map(spec => (
                      <li key={spec.label}><strong>{spec.label}:</strong> {spec.value}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews" id="reviews-accordion">
                <AccordionTrigger>Customer Reviews ({product.reviews.reviewCount})</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                        {product.reviews.items.map(review => (
                            <div key={review.id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                                <div className="flex items-center mb-1">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                    ))}
                                    <p className="ml-2 font-semibold text-foreground">{review.author}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">{new Date(review.date).toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                        ))}
                        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
                            <h4 className="font-semibold text-foreground">Write a review</h4>
                            <Textarea 
                                placeholder="Share your thoughts..." 
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows={4}
                            />
                            <Button type="submit" variant="outline" size="sm">Submit Review</Button>
                        </form>
                    </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProd => (
              <CompactProductCard key={relatedProd.id} {...relatedProd} onAddToCart={(prodId) => console.log("Related: Add to cart", prodId)} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;