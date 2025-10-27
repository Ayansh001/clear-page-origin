
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormSection = ({ title, children, className = '' }: FormSectionProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">{title}</Label>
      {children}
    </div>
  );
};

export default FormSection;
