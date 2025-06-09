import React from 'react';
import { Star, MessageSquare } from 'lucide-react'; // Icons for stars and review count
import { cn } from '@/lib/utils';

interface ReviewSnapshotProps {
  averageRating: number; // e.g., 4.5
  reviewCount: number;
  maxRating?: number;
  starSize?: number; // Size of the star icons in pixels
  className?: string;
  onReviewsClick?: () => void; // Optional: Action when clicking to see all reviews
}

const ReviewSnapshot: React.FC<ReviewSnapshotProps> = ({
  averageRating,
  reviewCount,
  maxRating = 5,
  starSize = 16,
  className,
  onReviewsClick,
}) => {
  console.log("Rendering ReviewSnapshot:", averageRating, "stars,", reviewCount, "reviews");

  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;
  const emptyStars = maxRating - filledStars - (hasHalfStar ? 1 : 0);

  const starArray = [];
  for (let i = 0; i < filledStars; i++) starArray.push('full');
  if (hasHalfStar) starArray.push('half');
  for (let i = 0; i < emptyStars; i++) starArray.push('empty');

  const starElements = starArray.map((type, i) => {
    const fillPercent = type === 'full' ? '100%' : type === 'half' ? '50%' : '0%';
    const starId = `star-${i}`;
    return (
      <svg
        key={i}
        width={starSize}
        height={starSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-yellow-400"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={starId}>
            <stop offset={fillPercent} stopColor="currentColor" />
            <stop offset={fillPercent} stopColor="gray" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={`url(#${starId})`}
        />
      </svg>
    );
  });

  const WrapperComponent = onReviewsClick ? 'button' : 'div';

  return (
    <WrapperComponent
      className={cn("flex items-center gap-2 text-sm text-muted-foreground", className, onReviewsClick && "hover:text-foreground cursor-pointer")}
      onClick={onReviewsClick}
      aria-label={onReviewsClick ? `Rated ${averageRating.toFixed(1)} out of ${maxRating} stars based on ${reviewCount} reviews. Click to read reviews.` : undefined}
    >
      <div className="flex" aria-hidden={!onReviewsClick}>
        {starElements}
      </div>
      <span className={cn(onReviewsClick ? "" : "sr-only")}>
        {averageRating.toFixed(1)}
      </span>
      <span className="hidden sm:inline" aria-hidden={!onReviewsClick}>
        ({reviewCount} reviews)
      </span>
      <span className="sm:hidden" aria-hidden={!onReviewsClick}>
        ({reviewCount})
      </span>
      {!onReviewsClick && ( // For screen readers if not clickable
         <span className="sr-only">Rated {averageRating.toFixed(1)} out of {maxRating} stars based on {reviewCount} reviews.</span>
      )}
    </WrapperComponent>
  );
};

export default ReviewSnapshot;