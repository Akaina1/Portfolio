import React from 'react';

import type { CallToActionBlock as CTABlockProps } from '@/payload-types';

import RichText from '@/components/RichText';
import { CMSLink } from '@/components/Link';

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  links,
  richText,
}) => {
  return (
    <div className="container">
      <div className="container flex w-full flex-col gap-8 rounded-xl border border-border bg-white/50 p-4 shadow-lg shadow-black/35 md:flex-row md:items-center md:justify-between md:p-10 dark:bg-white/5">
        <div className="flex max-w-[48rem] items-center">
          {richText && (
            <RichText className="mb-0" data={richText} enableGutter={false} />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />;
          })}
        </div>
      </div>
    </div>
  );
};
