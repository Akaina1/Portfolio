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
    <div className={`w-full py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Determine step status
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const _isPending = index > currentStep;

          // Set classes based on step status
          const stepClasses = `
            flex flex-col items-center relative
            ${isStepClickable(index) ? 'cursor-pointer' : 'cursor-default'}
            ${
              isCompleted
                ? 'text-green-600 dark:text-green-400'
                : isCurrent
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-400 dark:text-gray-500'
            }
          `;

          // Set circle classes based on step status
          const circleClasses = `
            flex items-center justify-center w-10 h-10 rounded-full
            ${
              isCompleted
                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-600 dark:border-green-500'
                : isCurrent
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-600 dark:border-purple-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600'
            }
          `;

          return (
            <div
              key={index}
              className={stepClasses}
              onClick={() => handleStepClick(index)}
              role={isStepClickable(index) ? 'button' : undefined}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Step connector line */}
              {index > 0 && (
                <div
                  className={`absolute left-0 top-5 h-0.5 w-full -translate-x-1/2 ${
                    index <= currentStep
                      ? 'bg-green-600 dark:bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step circle */}
              <div className={circleClasses}>
                {isCompleted ? (
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
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

              {/* Step label */}
              <div className="mt-2 text-sm font-medium">{step.label}</div>

              {/* Step description (optional) */}
              {step.description && (
                <div className="mt-1 max-w-[120px] text-center text-xs text-gray-500 dark:text-gray-400">
                  {step.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
