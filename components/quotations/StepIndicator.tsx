import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { n: 1, label: 'Product & Packaging' },
  { n: 2, label: 'Ingredients' },
  { n: 3, label: 'Review & Generate' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const isCompleted = currentStep > step.n;
        const isActive = currentStep === step.n;

        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  isCompleted
                    ? 'bg-[#25d366] text-white'
                    : isActive
                    ? 'text-white'
                    : 'bg-white border-2 border-[#c3c3c3] text-[#a3a29e]',
                ].join(' ')}
                style={isActive ? { background: 'linear-gradient(135deg, #7c9f43, #314f2d)' } : {}}
              >
                {isCompleted ? <Check size={16} /> : step.n}
              </div>
              <span
                className={`text-[12px] font-medium text-center max-w-[100px] leading-tight ${
                  isActive ? 'text-[#314f2d]' : isCompleted ? 'text-[#25d366]' : 'text-[#a3a29e]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 -mt-4 rounded transition-colors ${
                  currentStep > step.n ? 'bg-[#25d366]' : 'bg-[#c3c3c3]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
