// app/blocks/PartnerReel/index.tsx
import { Media } from '@/components/Media';
import Image from 'next/image';
import type { MarqueeBlockType } from '@/payload-types';

// Default logos to display when no images are provided
const DEFAULT_LOGOS = [
  { src: '/media/react-svgrepo-com.svg', alt: 'Default Logo 1' },
  // Add more default logos as needed
];

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
    // If no images provided, use default logos
    if (!images || images.length === 0) {
      return DEFAULT_LOGOS.map((logo, index) => (
        <Image
          key={`${isClone ? 'clone-' : ''}${index}`}
          src={logo.src}
          alt={logo.alt}
          width={100}
          height={100}
          className={`marquee__item marquee__item--${index + 1} object-contain`}
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
    <div className="marquee marquee--8 relative left-1/2 right-1/2 my-14 -ml-[50vw] -mr-[50vw] h-full w-screen bg-gray-100 py-2 dark:bg-gray-800">
      <div className="marquee__content">{renderContent()}</div>
      <div className="marquee__content" aria-hidden="true">
        {renderContent(true)}
      </div>
    </div>
  );
};
