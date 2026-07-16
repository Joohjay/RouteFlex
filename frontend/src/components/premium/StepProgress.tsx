import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <>
      {/* Desktop */}
      <div className={cn('mb-10 hidden sm:block', className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1.5 }}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                      isCompleted
                        ? 'border-[#f59e0b] bg-[#f59e0b] text-white'
                        : isCurrent
                        ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]'
                        : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                    )}
                  >
                    {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                  </motion.div>
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium',
                      isCurrent || isCompleted ? 'text-[#f59e0b]' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="relative mx-4 h-px flex-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-[#f59e0b]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="mb-8 flex items-center justify-center sm:hidden">
        <motion.span
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]"
        >
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
        </motion.span>
      </div>
    </>
  );
}
