import React from 'react';

import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

import RichText from '@/components/RichText';
import { CMSLink } from '@/components/Link';
import { cn } from '@/utilities/cn';

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  links,
  richText,
}) => {
  return (
    <div className="container">
      <div
        className={cn(
          'container flex w-full flex-col gap-8 rounded-2xl border',
          'border-border bg-white/50 p-4 shadow-lg shadow-black/35',
          'md:flex-row md:items-center md:justify-between md:p-10',
          'dark:bg-white/5 dark:shadow-white/15 dark:drop-shadow-sm'
        )}
      >
        <div className="flex max-w-[48rem] items-center">
          {richText && (
            <RichText className="mb-0" data={richText} enableGutter={false} />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="default" {...link} />;
          })}
        </div>
      </div>
    </div>
  );
};
