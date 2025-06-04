// app/blocks/PartnerReel/index.tsx
import { Media } from '@/components/Media';
import Image from 'next/image';
import type { MarqueeBlockType } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { DEFAULT_LOGOS } from './logo.data';

/**
 * PartnerReelBlock Component
 *
 * This React functional component renders a scrolling marquee of partner logos. The marquee contains two sets of logos:
 * the original set and a cloned set. The cloned set is used to create a seamless infinite scrolling effect.
 *
 * @param {PartnerReelBlockType} props - The component props.
 * @param {Images[]} props.images - An array of image objects representing partner logos. Each object contains an `id` and `image`.
 *
 * @returns {JSX.Element} A scrolling marquee of partner logos.
 */

export const MarqueeBlock: React.FC<MarqueeBlockType> = ({ images }) => {
  const renderContent = (isClone = false) => {
    if (!images || images.length === 0) {
      return DEFAULT_LOGOS.map((logo, index) => (
        <Image
          key={`${isClone ? 'clone-' : ''}${index}`}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className={`marquee__item marquee__item--${index + 1} ml-10 object-contain`}
          style={
            {
              // Set custom properties for each logo
              '--logo-width': `${logo.width}px`,
              '--logo-height': `${logo.height}px`,
            } as React.CSSProperties
          }
        />
      ));
    }

    // If images are provided, use Media component
    return images.map(
      ({ image, id }, index) =>
        image && (
          <Media
            key={`${isClone ? 'clone-' : ''}${id || index}`}
            resource={image}
            imgClassName={`marquee__item marquee__item--${index + 1} h-full w-auto object-contain`}
            alt={`Partner logo ${index + 1}`}
          />
        )
    );
  };

  return (
    <div
      className={cn(
        'marquee marquee--8 relative left-1/2 right-1/2 my-14 -ml-[50vw] -mr-[50vw] max-h-[110px] w-screen bg-white/50 dark:bg-zinc-900',
        images && images.length > 0 ? 'py-3' : ''
      )}
    >
      <div className="marquee__content">{renderContent()}</div>
      <div className="marquee__content" aria-hidden="true">
        {renderContent(true)}
      </div>
    </div>
  );
};
