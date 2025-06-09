import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselSlide {
  id: string | number;
  content: React.ReactNode; // Can be complex JSX
  altText: string; // For accessibility of the slide itself
  backgroundClass?: string; // e.g., bg-blue-500
}

interface CarouselProps {
  slides: CarouselSlide[];
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayOptions?: Parameters<typeof Autoplay>[0];
  showArrows?: boolean;
  showDots?: boolean;
  slideClassName?: string; // Custom classes for each slide panel
  containerClassName?: string; // Custom classes for the embla__container
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  options = { loop: true },
  autoplayOptions = { delay: 4000, stopOnInteraction: true },
  showArrows = true,
  showDots = true,
  slideClassName,
  containerClassName,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const scrollTo = React.useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect(); // Initial selection
    setScrollSnaps(emblaApi.scrollSnapList()); // Get scroll snaps for dots
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  console.log("Rendering Carousel with", slides.length, "slides. Selected index:", selectedIndex);

  if (!slides || slides.length === 0) {
    return <div className="text-center p-4">No slides to display.</div>;
  }

  return (
    <div className="relative group overflow-hidden" aria-roledescription="carousel" aria-label="Image carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn("flex", containerClassName)} aria-live="off">
          {slides.map((slide, index) => (
            <div
              className={cn("flex-[0_0_100%] min-w-0 relative", slide.backgroundClass, slideClassName)}
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.altText}`}
            >
              <Card className="m-0 border-0 shadow-none bg-transparent h-full">
                <CardContent className="flex items-center justify-center p-0 h-full w-full">
                  {slide.content}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2" role="tablist" aria-label="Carousel Pagination">
          {scrollSnaps.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={cn(
                "h-2 w-2 p-0 rounded-full transition-all",
                index === selectedIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              onClick={() => scrollTo(index)}
              aria-selected={index === selectedIndex}
              aria-controls={`slide-${index}`} // Assuming slide content has an ID like this
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;