import type { StaticImageData } from 'next/image';
import { cn } from 'src/utilities/cn';
import React, { useEffect, useRef, useState } from 'react';
import type { AnimateMedia as AnimateMediaProps } from '@/payload-types';
import { Media } from '../../components/Media';

type Props = AnimateMediaProps & {
  className?: string;
  imgClassName?: string;
  staticImage?: StaticImageData;
};

export const AnimateMedia: React.FC<Props> = (props) => {
  const { className, imgClassName, media, staticImage, position } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setIsVisible(true);
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.4,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasBeenVisible]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex w-full border-black/30 dark:drop-shadow-dark-outline-white',
          position === 'start' ? 'justify-start' : 'justify-end',
          {
            'animate-slide-from-left': isVisible && position === 'start',
            'animate-slide-from-right': isVisible && position === 'end',
          },
          className
        )}
      >
        <Media
          imgClassName={cn(
            'border-b-2 border-r-2 border-l border-t',
            {
              'rounded-r-2xl': position === 'start',
              'rounded-l-2xl': position === 'end',
            },
            'dark:drop-shadow-dark-outline-white',
            imgClassName
          )}
          resource={media}
          src={staticImage}
        />
      </div>
    </div>
  );
};
