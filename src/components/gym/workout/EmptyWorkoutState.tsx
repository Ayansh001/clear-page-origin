
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyWorkoutStateProps {
  onCreateWorkout: () => void;
}

const EmptyWorkoutState = ({ onCreateWorkout }: EmptyWorkoutStateProps) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-600">No workouts created yet</h3>
      <p className="text-sm text-gray-500 mt-1">
        Get started by creating your first workout routine
      </p>
      <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={onCreateWorkout}>
        <Plus size={16} className="mr-1" /> Create New Workout
      </Button>
    </div>
  );
};

export default EmptyWorkoutState;
