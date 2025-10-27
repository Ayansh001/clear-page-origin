
import { useState } from 'react';
import { PlusIcon, MinusIcon, GlassWaterIcon } from 'lucide-react';
import WaterVisual from './ui/WaterVisual';
import { cn } from '@/lib/utils';

interface WaterTrackerProps {
  currentAmount: number;
  goalAmount: number;
  onAmountChange: (amount: number) => void;
  className?: string;
}

const WaterTracker = ({
  currentAmount,
  goalAmount,
  onAmountChange,
  className
}: WaterTrackerProps) => {
  const waterPercentage = Math.min(100, Math.round((currentAmount / goalAmount) * 100));
  
  const addWater = (amount: number) => {
    onAmountChange(currentAmount + amount);
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="section-heading">Water Intake</h3>
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center">
              <WaterVisual percentage={waterPercentage} size="lg" />
              <span className="text-sm text-muted-foreground mt-2">
                {Math.round(waterPercentage)}% of daily goal
              </span>
            </div>
            
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="text-center md:text-left">
                <h4 className="text-sm font-medium text-muted-foreground">Current</h4>
                <div className="flex items-baseline">
                  <span className="stat-value text-water-700">{currentAmount}</span>
                  <span className="text-sm text-muted-foreground ml-1">ml</span>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h4 className="text-sm font-medium text-muted-foreground">Goal</h4>
                <div className="flex items-baseline">
                  <span className="text-xl font-medium">{goalAmount}</span>
                  <span className="text-sm text-muted-foreground ml-1">ml</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <WaterButton amount={200} onClick={addWater} />
                <WaterButton amount={350} onClick={addWater} />
                <WaterButton amount={500} onClick={addWater} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h4 className="text-sm font-medium mb-3">Custom Amount</h4>
        <div className="flex items-center">
          <button
            onClick={() => onAmountChange(Math.max(0, currentAmount - 50))}
            className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <MinusIcon size={18} />
          </button>
          
          <div className="mx-4 flex-1">
            <input
              type="range"
              min="0"
              max={goalAmount * 2}
              step="50"
              value={currentAmount}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-water-600"
            />
          </div>
          
          <button
            onClick={() => onAmountChange(currentAmount + 50)}
            className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <PlusIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface WaterButtonProps {
  amount: number;
  onClick: (amount: number) => void;
}

const WaterButton = ({ amount, onClick }: WaterButtonProps) => (
  <button
    onClick={() => onClick(amount)}
    className="flex items-center space-x-1 px-3 py-2 bg-water-100 hover:bg-water-200 text-water-800 rounded-lg transition-colors"
  >
    <GlassWaterIcon size={16} />
    <span>{amount}ml</span>
  </button>
);

export default WaterTracker;
