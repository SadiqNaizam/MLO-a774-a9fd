import React, { useState } from 'react';
import SiteNavigationMenu from '@/components/layout/SiteNavigationMenu';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar'; // Custom Sidebar
import CompactProductCard from '@/components/CompactProductCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { ListFilter, LayoutGrid, LayoutList, X } from 'lucide-react';

const allProducts = Array.from({ length: 25 }, (_, i) => ({
  id: `plp${i + 1}`,
  name: `Awesome Product ${i + 1}`,
  price: parseFloat((Math.random() * 200 + 50).toFixed(2)),
  imageUrl: `https://source.unsplash.com/random/400x533?product,vibrant&r=${i}`, // Add random query to vary images
  productUrl: `/product-detail/plp${i + 1}`,
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
  reviewCount: Math.floor(Math.random() * 200 + 10),
  category: ['Electronics', 'Apparel', 'Home Goods', 'Books'][i % 4],
  brand: ['BrandA', 'BrandB', 'BrandC'][i % 3],
  tags: i % 5 === 0 ? ['New'] : (i % 7 === 0 ? ['Sale', 'Featured'] : []),
}));

const ITEMS_PER_PAGE = 12;

const ProductListingPage: React.FC = () => {
  console.log('ProductListingPage loaded');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevant');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filtering logic
  const filteredProducts = allProducts.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const inBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return inPriceRange && inCategory && inBrand;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    return 0; // 'relevant' or default
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };
  
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleAddToCart = (productId: string | number) => {
    console.log(`PLP: Adding product ${productId} to cart`);
  };
  
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
  const uniqueBrands = [...new Set(allProducts.map(p => p.brand))];

  const renderPaginationItems = () => {
    const items = [];
    if (totalPages <= 1) return null;

    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} disabled={currentPage === 1} />
      </PaginationItem>
    );

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1); }} isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 3) {
        items.push(<PaginationItem key="ellispsis-start"><PaginationEllipsis /></PaginationItem>);
      }
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <=3) {
        startPage = 2;
        endPage = Math.min(totalPages -1, 4);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages -1;
      }


      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 2) {
         items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
       items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} disabled={currentPage === totalPages}/>
      </PaginationItem>
    );
    return items;
  };


  const filtersContent = (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {uniqueCategories.map(cat => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox id={`cat-${cat}`} checked={selectedCategories.includes(cat)} onCheckedChange={() => handleCategoryChange(cat)} />
                <Label htmlFor={`cat-${cat}`} className="font-normal">{cat}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent className="space-y-2">
             {uniqueBrands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={`brand-${brand}`} checked={selectedBrands.includes(brand)} onCheckedChange={() => handleBrandChange(brand)} />
                <Label htmlFor={`brand-${brand}`} className="font-normal">{brand}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent className="pt-2">
            <Slider
              defaultValue={[0, 250]}
              min={0}
              max={250}
              step={10}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="w-full md:hidden" onClick={() => setIsMobileFiltersOpen(false)}>Apply Filters</Button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteNavigationMenu siteTitle="EcomStore" />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Browse our curated selection of fine products.</p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Trigger */}
          <div className="md:hidden mb-4 flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)}>
              <ListFilter className="mr-2 h-4 w-4" /> Filters
            </Button>
             <p className="text-sm text-muted-foreground">{filteredProducts.length} results</p>
          </div>

          {/* Sidebar for Filters (Desktop) */}
          <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
            <Sidebar title="Filter Products" showApplyButton={false}>
                {filtersContent}
            </Sidebar>
          </div>

          {/* Mobile Filter Sheet/Modal */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileFiltersOpen(false)}>
                <div 
                    className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-background p-6 shadow-lg transform transition-transform duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                            <X className="h-5 w-5"/>
                        </Button>
                    </div>
                    <div className="h-[calc(100vh-100px)] overflow-y-auto">
                        {filtersContent}
                    </div>
                </div>
            </div>
          )}

          {/* Main Product Grid / List */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground hidden md:block">{filteredProducts.length} results</p>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view">
                  <LayoutGrid className="h-5 w-5"/>
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="List view">
                  <LayoutList className="h-5 w-5"/>
                </Button>
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {paginatedProducts.map(product => (
                   viewMode === 'grid' ? (
                    <CompactProductCard key={product.id} {...product} onAddToCart={handleAddToCart} />
                   ) : (
                    // Basic List View Item (Could be a new component)
                    <div key={product.id} className="flex gap-4 border rounded-lg p-4 bg-card">
                        <img src={product.imageUrl} alt={product.name} className="w-24 h-32 object-cover rounded"/>
                        <div className="flex-1">
                            <Link to={product.productUrl} className="hover:underline"><h3 className="font-semibold text-lg">{product.name}</h3></Link>
                            <p className="text-primary font-medium text-lg">${product.price.toFixed(2)}</p>
                            {product.rating && <p className="text-xs text-muted-foreground">Rating: {product.rating}/5 ({product.reviewCount} reviews)</p>}
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">Short description of {product.name} goes here...</p>
                            <Button size="sm" className="mt-2" onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
                        </div>
                    </div>
                   )
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  {renderPaginationItems()}
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListingPage;