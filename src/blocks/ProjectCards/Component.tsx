'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Media } from '@/components/Media';
import { AnimatedDivider } from '@/components/AnimatedDivider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Project, ProjectCardsBlockType } from '@/payload-types';
import { cn } from '@/utilities/cn';

/**
 * Creates a URL-safe slug from a project title
 * @param title - The project title to convert to a slug
 * @returns A URL-safe slug string
 */
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Finds a project by its slug from an array of projects
 * @param projects - Array of projects to search through
 * @param slug - The slug to match against project titles
 * @returns The matching project or null if not found
 */
const findProjectBySlug = (
  projects: Project[],
  slug: string
): Project | null => {
  return (
    projects.find((project) => createSlug(project.title || '') === slug) || null
  );
};

/**
 * Enhanced utility function to format description text with code highlighting and proper structure
 * Handles numbered lists, bullet points, manual headings (###), and regular paragraphs with code formatting
 * @param description - The raw description text to format
 * @returns Formatted React nodes with proper structure and styling
 */
const formatDescription = (description: string): React.ReactNode => {
  // Split by double newlines to get paragraphs
  const paragraphs = description.split('\n\n');

  return paragraphs.map((paragraph, index) => {
    // Check if this paragraph contains numbered list items
    if (paragraph.match(/^\d+\./m)) {
      const lines = paragraph.split('\n');
      const elements: React.ReactNode[] = [];
      let currentListItems: string[] = [];

      lines.forEach((line, lineIndex) => {
        if (line.match(/^\d+\./)) {
          // If we have accumulated list items, render them first
          if (currentListItems.length > 0) {
            elements.push(
              <ul
                key={`ul-${index}-${lineIndex}`}
                className="mb-4 ml-6 list-disc space-y-2"
              >
                {currentListItems.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {formatTextWithCode(item)}
                  </li>
                ))}
              </ul>
            );
            currentListItems = [];
          }

          // Add the numbered item as a heading
          elements.push(
            <h4
              key={`h4-${index}-${lineIndex}`}
              className="mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white"
            >
              {formatTextWithCode(line)}
            </h4>
          );
        } else if (line.trim().match(/^###\s+/)) {
          // Manual heading with ###
          const headingText = line.replace(/^###\s+/, '');
          elements.push(
            <h3
              key={`h3-${index}-${lineIndex}`}
              className="mb-4 mt-6 text-xl font-bold text-gray-900 dark:text-white"
            >
              {formatTextWithCode(headingText)}
            </h3>
          );
        } else if (line.trim().match(/^\s*\*/)) {
          // Collect bullet points - remove the * and any leading whitespace
          const cleanedItem = line.replace(/^\s*\*\s*/, '');
          currentListItems.push(cleanedItem);
        } else if (line.trim()) {
          // Regular text line
          elements.push(
            <p
              key={`p-${index}-${lineIndex}`}
              className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {formatTextWithCode(line)}
            </p>
          );
        }
      });

      // Handle any remaining list items
      if (currentListItems.length > 0) {
        elements.push(
          <ul
            key={`ul-final-${index}`}
            className="mb-4 ml-6 list-disc space-y-2"
          >
            {currentListItems.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {formatTextWithCode(item)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <div key={`formatted-${index}`} className="mb-6">
          {elements}
        </div>
      );
    } else {
      // Check if this paragraph is a standalone list (starts with *) or contains headings
      const lines = paragraph.split('\n');
      const isListParagraph = lines.some((line) => line.trim().match(/^\s*\*/));
      const hasHeadings = lines.some((line) => line.trim().match(/^###\s+/));

      if (isListParagraph || hasHeadings) {
        const listItems: string[] = [];
        const otherElements: React.ReactNode[] = [];

        lines.forEach((line, lineIndex) => {
          if (line.trim().match(/^###\s+/)) {
            // This is a manual heading
            const headingText = line.replace(/^###\s+/, '');
            otherElements.push(
              <h3
                key={`h3-${index}-${lineIndex}`}
                className="mb-4 mt-6 text-xl font-bold text-gray-900 dark:text-white"
              >
                {formatTextWithCode(headingText)}
              </h3>
            );
          } else if (line.trim().match(/^\s*\*/)) {
            // This is a bullet point
            const cleanedItem = line.replace(/^\s*\*\s*/, '');
            listItems.push(cleanedItem);
          } else if (line.trim()) {
            // This is regular text
            otherElements.push(
              <p
                key={`p-${index}-${lineIndex}`}
                className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {formatTextWithCode(line)}
              </p>
            );
          }
        });

        return (
          <div key={`mixed-${index}`} className="mb-6">
            {otherElements}
            {listItems.length > 0 && (
              <ul className="mb-4 ml-6 list-disc space-y-2">
                {listItems.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    {formatTextWithCode(item)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      } else {
        // Regular paragraph - split by single newlines and render as separate paragraphs
        const lines = paragraph.split('\n').filter((line) => line.trim());
        return lines.map((line, lineIndex) => {
          // Check if this line is a heading
          if (line.trim().match(/^###\s+/)) {
            const headingText = line.replace(/^###\s+/, '');
            return (
              <h3
                key={`h3-standalone-${index}-${lineIndex}`}
                className="mb-4 mt-6 text-xl font-bold text-gray-900 dark:text-white"
              >
                {formatTextWithCode(headingText)}
              </h3>
            );
          } else {
            return (
              <p
                key={`${index}-${lineIndex}`}
                className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {formatTextWithCode(line)}
              </p>
            );
          }
        });
      }
    }
  });
};

/**
 * Helper function to format text with code highlighting using backticks
 * @param text - The text string to format
 * @returns React nodes with code segments properly highlighted
 */
const formatTextWithCode = (text: string): React.ReactNode => {
  // Split text by backticks to find code segments
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      // This is a code segment
      const codeText = part.slice(1, -1); // Remove backticks
      return (
        <code
          key={index}
          className="mx-1 rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        >
          {codeText}
        </code>
      );
    }
    return part;
  });
};

/**
 * Simplified formatting function for preview text in project cards
 * Only handles code highlighting and basic text, strips complex formatting
 * @param description - The raw description text to format
 * @returns Formatted React nodes suitable for preview display
 */
const formatPreviewDescription = (description: string): React.ReactNode => {
  // Take only the first few sentences for preview and remove complex formatting
  const cleanText = description
    .split('\n\n')[0] // Get first paragraph
    .replace(/^\d+\.\s*/gm, '') // Remove numbered list markers
    .replace(/^###\s*/gm, '') // Remove heading markers
    .replace(/^\s*\*\s*/gm, '') // Remove bullet points
    .replace(/\n/g, ' ') // Replace line breaks with spaces
    .trim();

  // Apply code formatting to the cleaned text
  return formatTextWithCode(cleanText);
};

/**
 * ProjectCardsBlock component that displays a grid of project cards with expandable details
 * Features caching, URL hash navigation, and smooth animations
 * @param props - Component props
 * @param props.limit - Maximum number of projects to display (default: 6)
 * @returns JSX element containing the project cards section
 */
export const ProjectCardsBlock: React.FC<ProjectCardsBlockType> = ({
  limit = 6,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Cache duration in milliseconds: 30 seconds for development, 1 hour for production
    const CACHE_DURATION =
      process.env.NODE_ENV === 'production'
        ? 60 * 60 * 1000 // 1 hour in milliseconds
        : 30 * 1000; // 30 seconds in milliseconds

    // Cache key for localStorage
    const CACHE_KEY = `projects-cache-${limit}`;

    const fetchProjects = async () => {
      try {
        // Check if we have cached data
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;

          if (!isExpired) {
            // Use cached data if not expired
            setProjects(data);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data if no cache or cache expired
        const response = await fetch(`/api/projects?limit=${limit}`);

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();

        // Save to cache with timestamp
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        setProjects(data as Project[]);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [limit]);

  // New useEffect to handle URL hash changes and initial load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#' character
      if (hash && projects.length > 0) {
        const project = findProjectBySlug(projects, hash);
        if (project && project !== expandedProject) {
          setExpandedProject(project);
        }
      } else if (!hash && expandedProject) {
        setExpandedProject(null);
      }
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [projects, expandedProject]);

  const handleCardClick = (project: Project) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Update URL hash with project slug
    const slug = createSlug(project.title || '');
    window.history.pushState(null, '', `#${slug}`);

    setExpandedProject(project);
    setTimeout(() => setIsAnimating(false), 500); // Match animation duration
  };

  const handleCloseExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Remove hash from URL
    window.history.pushState(null, '', window.location.pathname);

    setExpandedProject(null);
    setTimeout(() => setIsAnimating(false), 500); // Match animation duration
  };

  return (
    <section className="container w-full rounded-xl bg-white/50 p-4 shadow-lg shadow-black/35 md:p-10 lg:mt-4 dark:bg-white/5">
      <h1
        className={cn(
          'text-center text-5xl font-bold text-black dark:text-white',
          'transition-all duration-500 ease-in-out',
          expandedProject ? 'animate-fade-down animate-once' : ''
        )}
      >
        {expandedProject ? expandedProject.title : 'View My Projects'}
      </h1>

      {/* Divider Line */}
      <AnimatedDivider className="mb-4 mt-4" />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : projects.length > 0 ? (
        <>
          {expandedProject ? (
            <div
              className={cn(
                'flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800',
                'animate-fade-up animate-duration-500 animate-once animate-ease-in-out',
                'min-h-[600px]' // Minimum height but allows expansion
              )}
            >
              <button
                onClick={handleCloseExpanded}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-all hover:bg-white hover:text-red-500 dark:bg-gray-700/80 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {expandedProject.media && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Media
                    resource={expandedProject.media}
                    imgClassName="h-full w-full object-cover"
                    fill
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                <div className="w-full">
                  {expandedProject.description && (
                    <div className="max-w-none">
                      {formatDescription(expandedProject.description)}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-gray-600">
                  {expandedProject.liveLink && (
                    <Link
                      href={expandedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button variant="home-hero" size="sm" className="w-full">
                        View Live
                      </Button>
                    </Link>
                  )}

                  {expandedProject.githubLink && (
                    <Link
                      href={expandedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button variant="home-hero" size="sm" className="w-full">
                        GitHub
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[800px] lg:min-h-[400px]">
              <div className="grid animate-fade grid-cols-1 gap-6 animate-duration-500 animate-once animate-ease-in-out md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleCardClick(project)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center text-gray-500">
          No projects found.
        </div>
      )}
    </section>
  );
};

/**
 * Individual project card component that displays project information in a card format
 * @param props - Component props
 * @param props.project - The project data to display
 * @param props.onClick - Callback function when the card is clicked
 * @returns JSX element containing the project card
 */
const ProjectCard: React.FC<{
  project: Project;
  onClick: () => void;
}> = ({ project, onClick }) => {
  return (
    <div
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800"
      onClick={onClick}
    >
      {project.media && (
        <div className="relative h-48 w-full overflow-hidden">
          <Media
            resource={project.media}
            imgClassName="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            fill
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {project.title}
        </h3>

        {project.description && (
          <div className="mb-4 line-clamp-3 flex-1 text-gray-700 dark:text-gray-300">
            {formatPreviewDescription(project.description)}
          </div>
        )}

        <div className="mt-auto flex gap-3">
          {project.liveLink && (
            <Link
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="home-hero" size="sm">
                View Live
              </Button>
            </Link>
          )}

          {project.githubLink && (
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="home-hero" size="sm">
                GitHub
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
