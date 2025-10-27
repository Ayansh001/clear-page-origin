
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WaterTracker from '@/components/WaterTracker';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';
import { toast } from "sonner";

const Water = () => {
  // Load data from localStorage with fallback to initial values
  const [waterGoal, setWaterGoal] = useState<number>(() => 
    loadFromLocalStorage(STORAGE_KEYS.WATER_GOAL, 2000)
  );
  const [waterIntake, setWaterIntake] = useState<number>(() => 
    loadFromLocalStorage(STORAGE_KEYS.WATER_INTAKE, 0)
  );

  // Save water data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WATER_INTAKE, waterIntake);
  }, [waterIntake]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WATER_GOAL, waterGoal);
  }, [waterGoal]);

  // Add page entrance animation
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  const handleWaterChange = (amount: number) => {
    try {
      if (amount >= 0) {
        const previousAmount = waterIntake;
        setWaterIntake(amount);
        
        // Show toast only when increasing water intake
        if (amount > previousAmount) {
          toast.success("Water intake updated");
        }
      }
    } catch (error) {
      console.error("Error updating water intake:", error);
      toast.error("Failed to update water intake");
    }
  };

  const handleWaterGoalChange = (amount: number) => {
    try {
      if (amount >= 500 && amount <= 5000) {
        setWaterGoal(amount);
        toast.success("Water goal updated");
      } else {
        toast.error("Water goal must be between 500ml and 5000ml");
      }
    } catch (error) {
      console.error("Error updating water goal:", error);
      toast.error("Failed to update water goal");
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mt-24 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Water Tracking</h1>
            <p className="text-muted-foreground mt-2">Monitor your hydration level</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <WaterTracker
                currentAmount={waterIntake}
                goalAmount={waterGoal}
                onAmountChange={handleWaterChange}
              />
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="section-heading mb-4">Water Goal Settings</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set your daily water intake goal. The recommended amount is around 2000ml per day,
                    but you can adjust this based on your personal needs.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Daily Goal (ml)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={waterGoal}
                        onChange={(e) => handleWaterGoalChange(Number(e.target.value))}
                        className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-water-600"
                      />
                      <span className="min-w-[80px] text-right">{waterGoal}ml</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="section-heading mb-4">Hydration Tips</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Drink a glass of water first thing in the morning to jumpstart hydration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Carry a reusable water bottle with you throughout the day.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Set reminders to drink water every hour.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Increase water intake during and after exercise.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Eat water-rich foods like cucumber, watermelon, and oranges.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Water;
