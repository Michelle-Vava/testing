import React from 'react';
import { motion } from 'framer-motion';
import type { OnboardingStep } from './types';

interface OnboardingStepperProps {
  currentStep: OnboardingStep;
  stepConfig: Record<OnboardingStep, { title: string; number: number }>;
}

export function OnboardingStepper({ currentStep, stepConfig }: OnboardingStepperProps) {
  const progressPercentage = (stepConfig[currentStep].number / 3) * 100;

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        {(['business', 'services', 'review'] as OnboardingStep[]).map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  stepConfig[step].number <= stepConfig[currentStep].number
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {stepConfig[step].number}
              </div>
              <span className="text-xs mt-2 font-medium text-slate-600">
                {stepConfig[step].title}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`flex-1 h-1 mx-2 mt-[-20px] transition-colors ${
                  stepConfig[step].number < stepConfig[currentStep].number
                    ? 'bg-blue-600'
                    : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <motion.div
          className="bg-blue-600 h-full"
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
