import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from 'lucide-react'; // Example icons

interface CompactProductCardProps {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  productUrl: string; // URL for the product detail page
  rating?: number; // Optional average rating
  reviewCount?: number; // Optional review count
  tags?: string[]; // Optional tags like "New", "Sale"
  onAddToCart?: (id: string | number) => void; // Optional quick add to cart
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  productUrl,
  rating,
  reviewCount,
  tags,
  onAddToCart,
}) => {
  console.log("Rendering CompactProductCard:", name);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if card is a link
    e.stopPropagation();
    if (onAddToCart) {
      console.log("CompactProductCard: Add to cart clicked for:", name, id);
      onAddToCart(id);
    }
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-md group">
      <Link to={productUrl} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
        <CardContent className="p-0">
          <AspectRatio ratio={3 / 4} className="bg-muted">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
          {tags && tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="default" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </CardContent>
        <div className="p-3 space-y-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary">{name}</h3>
          {rating && reviewCount ? (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="ml-1">({reviewCount})</span>
            </div>
          ) : <div className="h-[18px]"></div> /* Placeholder for height consistency */}
          <p className="text-base font-semibold text-foreground">${price.toFixed(2)}</p>
        </div>
      </Link>
      {onAddToCart && (
        <CardFooter className="p-3 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddToCartClick}
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CompactProductCard;