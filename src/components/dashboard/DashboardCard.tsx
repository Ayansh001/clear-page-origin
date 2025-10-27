
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  progress: number;
  progressColor: string;
  linkTo: string;
}

const DashboardCard = ({
  icon,
  title,
  value,
  progress,
  progressColor,
  linkTo
}: DashboardCardProps) => (
  <Link to={linkTo} className="glass-card p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      <ChevronRightIcon className="text-muted-foreground" />
    </div>
    <div className="mt-4 w-full h-2 bg-muted/50 rounded-full overflow-hidden">
      <div 
        className={cn("h-full rounded-full", progressColor)}
        style={{ width: `${progress}%`, transition: 'width 1s ease-out' }}
      />
    </div>
    <p className="text-xs text-right mt-1 text-muted-foreground">{progress}% of daily goal</p>
  </Link>
);

export default DashboardCard;
