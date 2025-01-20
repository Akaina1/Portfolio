'use client';

import React from 'react';
import { Media } from '@/components/Media';
import Link from 'next/link';
import type { ProjectDisplayBlockType } from '@/payload-types';
import { cn } from '@/utilities/cn';

/**
 * ProjectDisplay Component
 * Displays projects in a grid layout with hover effects
 */
export const ProjectDisplayBlock: React.FC<ProjectDisplayBlockType> = ({
  projects = [],
}) => {
  // We'll show a minimum of 9 squares, filling empty ones with placeholders
  const minSquares = 9;
  const placeholdersNeeded = Math.max(0, minSquares - projects.length);

  return (
    <section className="container w-full rounded-xl bg-black/5 p-4 shadow-lg shadow-black/35 md:p-10 dark:bg-white/5">
      {/* Projects Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-2">
        {/* Project Squares */}
        {projects.map((project, index) => (
          <div
            key={`project-${index}`}
            className="group relative aspect-square"
          >
            {project.slug ? (
              <Link href={`/projects/${project.slug}`}>
                <ProjectSquare project={project} />
              </Link>
            ) : (
              <ProjectSquare project={project} />
            )}
          </div>
        ))}

        {/* Placeholder Squares */}
        {Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="group relative aspect-square"
          >
            <PlaceholderSquare />
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * ProjectSquare Component
 * Individual project display with image and hover effect
 */
const ProjectSquare: React.FC<{
  project: ProjectDisplayBlockType['projects'][0];
}> = ({ project }) => {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-90">
      {/* Project Image */}
      {project.displayImage && (
        <Media
          resource={project.displayImage}
          imgClassName="h-full w-full object-cover"
        />
      )}

      {/* Hover Overlay with Title */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'bg-black/0 p-4 text-center transition-all duration-300',
          'group-hover:bg-black'
        )}
      >
        <h3
          className={cn(
            'text-xl font-bold text-white opacity-0 transition-opacity',
            'duration-300 group-hover:opacity-100'
          )}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
};

/**
 * PlaceholderSquare Component
 * Matches the ProjectSquare hover effect exactly
 */
const PlaceholderSquare: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-tr from-gray-400 to-gray-300 transition-transform duration-300 group-hover:scale-90 dark:from-gray-500 dark:to-gray-700">
      {/* Hover Overlay with Title */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'bg-black/0 p-4 text-center transition-all duration-300',
          'group-hover:bg-black'
        )}
      >
        <h3
          className={cn(
            'text-xl font-bold text-white opacity-0 transition-opacity',
            'duration-300 group-hover:opacity-100'
          )}
        >
          Coming Soon
        </h3>
      </div>
    </div>
  );
};
