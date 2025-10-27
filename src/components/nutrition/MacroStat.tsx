
import { cn } from '@/lib/utils';

interface MacroStatProps {
  name: string;
  value: number;
  color: string;
}

const MacroStat = ({ name, value, color }: MacroStatProps) => (
  <div className="flex flex-col items-center">
    <div className={cn('w-2 h-2 rounded-full mb-1', color)} />
    <span className="text-lg font-medium">{value}g</span>
    <span className="text-xs text-muted-foreground">{name}</span>
  </div>
);

export default MacroStat;
