import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../../styles/components/_reference-images.scss";

interface ReferenceImagesProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
}

export function ReferenceImages({ images }: ReferenceImagesProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Set up the select listener
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Single image - no carousel needed
  if (images.length === 1) {
    return (
      <div className="reference-images">
        <div className="reference-images__single">
          <img src={images[0].src} alt={images[0].alt} />
        </div>
      </div>
    );
  }

  return (
    <div className="reference-images">
      <div className="reference-images__carousel" ref={emblaRef}>
        <div className="reference-images__container">
          {images.map((image, index) => (
            <div className="reference-images__slide" key={index}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>

      <div className="reference-images__controls">
        <button
          className="reference-images__button reference-images__button--prev"
          onClick={scrollPrev}
          aria-label="Previous image"
        >
          ←
        </button>
        <div className="reference-images__dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`reference-images__dot ${
                index === selectedIndex ? "reference-images__dot--active" : ""
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
        <button
          className="reference-images__button reference-images__button--next"
          onClick={scrollNext}
          aria-label="Next image"
        >
          →
        </button>
      </div>
    </div>
  );
}
