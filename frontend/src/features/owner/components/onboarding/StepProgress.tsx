interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

export function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((_, i) => {
          const stepNumber = i + 1;
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  stepNumber <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < steps.length && (
                <div
                  className={`h-1 w-32 mx-2 transition-colors ${
                    stepNumber < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-sm">
        {steps.map((label, i) => (
          <span
            key={label}
            className={
              currentStep >= i + 1
                ? 'text-primary-600 font-medium'
                : 'text-gray-500'
            }
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
