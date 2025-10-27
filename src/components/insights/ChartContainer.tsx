
import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

const ChartContainer = ({ title, children }: ChartContainerProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="section-heading">{title}</h3>
      {children}
    </div>
  );
};

export default ChartContainer;
