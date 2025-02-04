'use client';

//import { cn } from 'src/utilities/cn'
import React, { Fragment, useRef, useEffect, useState } from 'react';
import type { Page } from '@/payload-types';
import { cn } from '@/utilities/cn';

import { CallToActionBlock } from '@/blocks/CallToAction/Component';
import { ContentBlock } from '@/blocks/Content/Component';
import { FormBlock } from '@/blocks/Form/Component';
import { MediaBlock } from '@/blocks/MediaBlock/Component';
import { HomeHeroBlock } from '@/blocks/HomeHero/Component';
import { AnimateText } from '@/blocks/AnimateText/Component';
import { ProjectDisplayBlock } from '@/blocks/ProjectDisplay/Component';
import { HighlightTextBlock } from '@/blocks/HighlightText/Component';

const blockComponents = {
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  homeHero: HomeHeroBlock,
  animateText: AnimateText,
  projectDisplay: ProjectDisplayBlock,
  highlightText: HighlightTextBlock,
};

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][];
}> = (props) => {
  const { blocks } = props;
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback: IntersectionObserverCallback = (
      entries,
      _observer
    ) => {
      entries.forEach((entry) => {
        const index = blockRefs.current.findIndex(
          (ref) => ref === entry.target
        );

        if (entry.isIntersecting && !visibleBlocks.includes(index)) {
          // Get the block type to check if it's a highlightText block
          const blockType = blocks[index]?.blockType;

          // No delay for homeHero or highlightText blocks, standard delay for others
          const delay =
            blockType === 'homeHero' || blockType === 'highlightText'
              ? 0
              : 1500 + (index - 1) * 200;

          setTimeout(() => {
            setVisibleBlocks((prev) => [...prev, index]);
            _observer.unobserve(entry.target);
          }, delay);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all blocks
    blockRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [visibleBlocks, blocks]);

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <div
                  ref={(el) => {
                    if (el) {
                      blockRefs.current[index] = el;
                    }
                  }}
                  className={cn(
                    blockType === 'homeHero' ? 'my-0' : 'my-16',
                    blockType === 'homeHero'
                      ? 'animate-pull-down'
                      : visibleBlocks.includes(index)
                        ? 'animate-fade-in-up'
                        : 'opacity-0'
                  )}
                  key={index}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
