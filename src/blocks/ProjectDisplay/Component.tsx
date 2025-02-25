'use client';

import React, { useEffect, useState } from 'react';
import { Media } from '@/components/Media';
import Link from 'next/link';
import type { ProjectDisplayBlockType } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { AnimatedDivider } from '@/components/AnimatedDivider';

/**
 * Define the color object type
 */
type ProjectSquareColourData = {
  id: string;
  gradient: string;
};

/**
 * Update color constants to include identifiers
 */
const PROJECT_SQUARE_COLOURS: ProjectSquareColourData[] = [
  {
    id: 'RED',
    gradient: 'linear-gradient(to top right, rgb(220 38 38), rgb(254 202 202))', // red-600 to red-200
  },
  {
    id: 'BLUE',
    gradient: 'linear-gradient(to top right, rgb(37 99 235), rgb(191 219 254))', // blue-600 to blue-200
  },
  {
    id: 'GREEN',
    gradient: 'linear-gradient(to top right, rgb(22 163 74), rgb(187 247 208))', // green-600 to green-200
  },
  {
    id: 'YELLOW',
    gradient: 'linear-gradient(to top right, rgb(202 138 4), rgb(254 240 138))', // yellow-600 to yellow-200
  },
  {
    id: 'PURPLE',
    gradient:
      'linear-gradient(to top right, rgb(147 51 234), rgb(233 213 255))', // purple-600 to purple-200
  },
  {
    id: 'PINK',
    gradient:
      'linear-gradient(to top right, rgb(219 39 119), rgb(251 207 232))', // pink-600 to pink-200
  },
  {
    id: 'ORANGE',
    gradient: 'linear-gradient(to top right, rgb(234 88 12), rgb(254 215 170))', // orange-600 to orange-200
  },
  {
    id: 'TEAL',
    gradient:
      'linear-gradient(to top right, rgb(13 148 136), rgb(153 246 228))', // teal-600 to teal-200
  },
  {
    id: 'INDIGO',
    gradient: 'linear-gradient(to top right, rgb(79 70 229), rgb(199 210 254))', // indigo-600 to indigo-200
  },
] as const;

type ProjectSquareColour = (typeof PROJECT_SQUARE_COLOURS)[number];

/**
 * Maintains state of available colors between function calls
 */
let availableColours: ProjectSquareColour[] = [...PROJECT_SQUARE_COLOURS];

/**
 * Returns a random color that hasn't been used since the last reset
 * Resets when all colors have been used
 */
const chooseUniqueRandomColour = (): ProjectSquareColour => {
  // Reset if all colours have been used
  if (availableColours.length === 0) {
    availableColours = [...PROJECT_SQUARE_COLOURS];
  }

  // Get random index from remaining colours
  const randomIndex = Math.floor(Math.random() * availableColours.length);

  // Remove and return the chosen colour
  const [chosenColour] = availableColours.splice(randomIndex, 1);

  return chosenColour;
};

type SquareColourAssignment = {
  id: string;
  colour: ProjectSquareColour;
};

/**
 * ProjectDisplay Component
 * Displays projects in a grid layout with hover effects and unique color assignments
 */
export const ProjectDisplayBlock: React.FC<ProjectDisplayBlockType> = ({
  projects = [],
}) => {
  const [squareColours, setSquareColours] = useState<SquareColourAssignment[]>(
    []
  );
  const minSquares = 9;
  const placeholdersNeeded = Math.max(0, minSquares - (projects?.length ?? 0));

  // Assign colors once on component mount
  useEffect(() => {
    const newSquareColours: SquareColourAssignment[] = [];

    // Assign colors to project squares
    projects?.forEach((_, index) => {
      newSquareColours.push({
        id: `project-${index}`,
        colour: chooseUniqueRandomColour(),
      });
    });

    // Assign colors to placeholder squares
    Array.from({ length: placeholdersNeeded }).forEach((_, index) => {
      newSquareColours.push({
        id: `placeholder-${index}`,
        colour: chooseUniqueRandomColour(),
      });
    });

    setSquareColours(newSquareColours);
  }, [placeholdersNeeded, projects]);

  const getSquareColour = (id: string): ProjectSquareColour | undefined => {
    return squareColours.find((square) => square.id === id)?.colour;
  };

  return (
    <section className="container w-full rounded-xl bg-white/50 p-4 shadow-lg shadow-black/35 md:p-10 dark:bg-white/5">
      <h2 className="text-center text-4xl font-bold text-black dark:text-white">
        View My Projects
      </h2>

      {/* Divider Line */}
      <AnimatedDivider className="mb-8 mt-2" />

      {/* Projects Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-2">
        {/* Project Squares */}
        {projects?.map((project, index) => {
          const squareId = `project-${index}`;
          const bgColor = getSquareColour(squareId);

          return (
            <div key={squareId} className="group relative aspect-square">
              <ProjectSquare project={project} hoverColor={bgColor} />
            </div>
          );
        })}

        {/* Placeholder Squares */}
        {Array.from({ length: placeholdersNeeded }).map((_, index) => {
          const squareId = `placeholder-${index}`;
          const bgColor = getSquareColour(squareId);

          return (
            <div key={squareId} className="group relative aspect-square">
              <PlaceholderSquare hoverColor={bgColor} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

/**
 * ProjectSquare Component
 * Individual project display with image and hover effect
 */
const ProjectSquare: React.FC<{
  project: NonNullable<ProjectDisplayBlockType['projects']>[number];
  hoverColor?: ProjectSquareColour;
}> = ({ project, hoverColor }) => {
  return (
    <Link
      href={project.slug ? `/projects/${project.slug}` : '#'}
      className={cn(
        'relative block h-full w-full overflow-hidden rounded-xl transition-transform duration-300',
        'hover:scale-95'
      )}
      tabIndex={0}
      aria-label={`View ${project.title} project`}
    >
      {project.displayImage && (
        <Media
          resource={project.displayImage}
          imgClassName="h-full w-full object-cover"
        />
      )}

      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          'bg-transparent p-4 text-center',
          'transition-all duration-300 group-hover:bg-opacity-90'
        )}
        style={
          {
            '--hover-color':
              hoverColor?.gradient ||
              'linear-gradient(to top right, rgb(0 0 0), rgb(0 0 0))',
            backgroundImage: 'none',
            ['--tw-bg-opacity']: '0',
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.backgroundImage = 'var(--hover-color)';
          target.style['--tw-bg-opacity'] = '0.9';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.backgroundImage = 'none';
          target.style['--tw-bg-opacity'] = '0';
        }}
      >
        <h3
          className={cn(
            'mb-4 text-sm font-bold text-white transition-opacity lg:text-lg',
            'group-hover:opacity-100',
            'opacity-0'
          )}
        >
          {project.title}
        </h3>
      </div>
    </Link>
  );
};

/**
 * PlaceholderSquare Component
 * Matches the ProjectSquare hover effect
 */
const PlaceholderSquare: React.FC<{
  hoverColor?: ProjectSquareColour;
}> = ({ hoverColor }) => {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-xl transition-transform duration-300',
        'bg-gradient-to-tr from-neutral-400 via-neutral-500 to-neutral-700',
        'hover:scale-95'
      )}
      role="button"
      tabIndex={0}
    >
      <div
        className="absolute inset-0 flex items-center justify-center bg-transparent p-4 text-center transition-all duration-300"
        style={
          {
            '--hover-color':
              hoverColor?.gradient ||
              'linear-gradient(to top right, rgb(0 0 0), rgb(0 0 0))',
            backgroundImage: 'none',
            ['--tw-bg-opacity']: '0',
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.backgroundImage = 'var(--hover-color)';
          target.style['--tw-bg-opacity'] = '0.9';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.backgroundImage = 'none';
          target.style['--tw-bg-opacity'] = '0';
        }}
      >
        <h3
          className={cn(
            'text-lg font-bold text-white transition-opacity',
            'group-hover:opacity-100',
            'opacity-0'
          )}
        >
          Coming Soon
        </h3>
      </div>
    </div>
  );
};
