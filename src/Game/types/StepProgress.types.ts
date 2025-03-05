/**
 * Step information interface
 */
export interface Step {
  label: string;
  description?: string;
}

/**
 * Props for the StepProgress component
 */
export interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}
