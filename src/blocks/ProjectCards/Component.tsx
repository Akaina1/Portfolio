'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Media } from '@/components/Media';
import { AnimatedDivider } from '@/components/AnimatedDivider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Project, ProjectCardsBlockType } from '@/payload-types';
import { cn } from '@/utilities/cn';

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

  const handleCardClick = (project: Project) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedProject(project);
    setTimeout(() => setIsAnimating(false), 500); // Match animation duration
  };

  const handleCloseExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);
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
        <div className="relative min-h-[800px] lg:min-h-[400px]">
          {expandedProject ? (
            <div
              className={cn(
                'absolute inset-0 flex flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800',
                'animate-fade-up animate-duration-500 animate-once animate-ease-in-out'
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

              <div className="flex flex-1 flex-col px-4 pt-6">
                <div className="flex-1 overflow-y-auto lg:mb-6">
                  {expandedProject.description && (
                    <p className="text-gray-700 dark:text-gray-300">
                      {expandedProject.description}
                    </p>
                  )}
                </div>

                <div className="mb-4 mt-auto flex flex-wrap gap-3">
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
            <div className="grid animate-fade grid-cols-1 gap-6 animate-duration-500 animate-once animate-ease-in-out md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleCardClick(project)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          No projects found.
        </div>
      )}
    </section>
  );
};

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
          <p className="mb-4 line-clamp-3 flex-1 text-gray-700 dark:text-gray-300">
            {project.description}
          </p>
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
