
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WaterVisualProps {
  percentage: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

const WaterVisual = ({ 
  percentage,
  size = 'md',
  showPercentage = true,
  className 
}: WaterVisualProps) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  
  // Sizes
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };
  
  // Font sizes
  const fontSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
  
  // Animate the percentage number
  useEffect(() => {
    const animatePercentage = () => {
      const duration = 1000; // 1 second
      const interval = 10; // update every 10ms
      const steps = duration / interval;
      const increment = percentage / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          current = percentage;
          clearInterval(timer);
        }
        setDisplayPercentage(Math.round(current));
      }, interval);
      
      return () => clearInterval(timer);
    };
    
    animatePercentage();
  }, [percentage]);
  
  // Clamp percentage between 0-100
  const safePercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className={cn('relative', sizes[size], className)}>
      {/* Container */}
      <div className="absolute inset-0 rounded-full border-4 border-water-100 bg-water-50/30 overflow-hidden">
        {/* Water Fill */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-water-400/80 water-fill"
          style={{ 
            height: `${safePercentage}%`,
            transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Wave Effect */}
          <div 
            className="absolute left-0 bottom-0 w-[200%] h-[100%]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-31.8z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: '50% 100%',
              animation: 'wave 8s linear infinite',
            }}
          />
        </div>
      </div>
      
      {/* Percentage Text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'font-display font-bold text-foreground',
            fontSizes[size]
          )}>
            {displayPercentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default WaterVisual;
