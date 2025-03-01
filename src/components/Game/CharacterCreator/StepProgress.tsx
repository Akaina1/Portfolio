import React from 'react';

/**
 * Step information interface
 */
interface Step {
  label: string;
  description?: string;
}

/**
 * Props for the StepProgress component
 */
interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

/**
 * StepProgress Component
 *
 * Displays a horizontal progress indicator for multi-step forms.
 * Shows completed steps, current step, and upcoming steps.
 * Optionally allows navigation to previous steps.
 */
const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  // Determine if a step is clickable (only completed steps or current step)
  const isStepClickable = (stepIndex: number) => {
    return onStepClick && stepIndex <= currentStep;
  };

  // Handle step click if enabled
  const handleStepClick = (stepIndex: number) => {
    if (isStepClickable(stepIndex)) {
      onStepClick?.(stepIndex);
    }
  };

  return (
    <div className={`w-full px-14 py-4 ${className}`}>
      {/* Main container with relative positioning */}
      <div className="relative h-36">
        {/* Horizontal line for the progress indicator */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-300 dark:bg-gray-600" />

        {/* Progress line */}
        <div
          className="absolute left-0 top-5 h-0.5 bg-purple-600 dark:bg-purple-500"
          style={{
            width: `${currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Circles and labels container */}
        <div className="absolute left-0 right-0 top-0 flex justify-between">
          {steps.map((step, index) => {
            // Determine step status
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const _isPending = index > currentStep;

            // Color classes based on status
            const textColorClass =
              isCompleted || isCurrent
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-400 dark:text-gray-500';

            // Circle background and border classes based on status
            const circleBgClass =
              isCompleted || isCurrent
                ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-600 dark:border-purple-500'
                : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600';

            return (
              <div
                key={index}
                className={`relative ${textColorClass} ${isStepClickable(index) ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => handleStepClick(index)}
                role={isStepClickable(index) ? 'button' : undefined}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Circle element - positioned absolutely on the line */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${circleBgClass}`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Label - positioned below circle with consistent spacing */}
                <div className="absolute left-1/2 top-12 mt-2 w-28 -translate-x-1/2 text-center">
                  <div className="text-sm font-medium">{step.label}</div>

                  {/* Description - optional */}
                  {step.description && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
