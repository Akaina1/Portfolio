import type { StaticImageData } from 'next/image';

import { cn } from 'src/utilities/cn';
import React from 'react';
import RichText from '@/components/RichText';

import type { MediaBlock as MediaBlockProps } from '@/payload-types';

import { Media } from '../../components/Media';

type Props = MediaBlockProps & {
  breakout?: boolean;
  captionClassName?: string;
  className?: string;
  enableGutter?: boolean;
  imgClassName?: string;
  staticImage?: StaticImageData;
  disableInnerContainer?: boolean;
};

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    position,
  } = props;

  let caption;
  if (media && typeof media === 'object') caption = media.caption;

  return (
    <div
      className={cn(
        `flex justify-${position}`,
        {
          container: enableGutter,
        },
        className
      )}
    >
      <Media
        imgClassName={cn(
          'shadow-lg shadow-black/50 border-b-2 border-r-2 border-l border-t',
          'border-black/30 dark:border-white/15 rounded-2xl',
          'dark:drop-shadow-dark-outline-white',
          imgClassName
        )}
        resource={media}
        src={staticImage}
      />
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  );
};
