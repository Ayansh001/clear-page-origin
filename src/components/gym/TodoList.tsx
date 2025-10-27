
import { useState } from 'react';
import { format } from 'date-fns';
import { GymTask } from '@/lib/types';
import { Plus, Check, Trash2, CheckCircle, Circle, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface TodoListProps {
  tasks: GymTask[];
  onAddTask: (task: Omit<GymTask, 'id'>) => void;
  onToggleTask: (id: string) => void;
}

const TodoList = ({ tasks, onAddTask, onToggleTask }: TodoListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState<Date>(new Date());
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;
    
    onAddTask({
      title: newTaskTitle,
      completed: false,
      date: taskDate
    });
    
    setNewTaskTitle('');
  };
  
  // Filter tasks for today
  const todayTasks = tasks.filter(task => 
    format(new Date(task.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  
  // Filter other tasks
  const otherTasks = tasks.filter(task => 
    format(new Date(task.date), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gym To-Do List</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex gap-3">
            <div className="flex-1">
              <Input 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)} 
                placeholder="Enter a new task..." 
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-[130px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(taskDate, 'MMM d')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={taskDate}
                  onSelect={(date) => date && setTaskDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button type="submit" disabled={!newTaskTitle.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Today's Tasks
              <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded">
                {todayTasks.filter(t => t.completed).length}/{todayTasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length > 0 ? (
              <ul className="space-y-3">
                {todayTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={onToggleTask} 
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No tasks for today
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Upcoming Tasks
              <span className="text-sm font-normal bg-muted text-muted-foreground px-2 py-1 rounded">
                {otherTasks.filter(t => t.completed).length}/{otherTasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {otherTasks.length > 0 ? (
              <ul className="space-y-3">
                {otherTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={onToggleTask}
                    showDate 
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming tasks
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: GymTask;
  onToggle: (id: string) => void;
  showDate?: boolean;
}

const TaskItem = ({ task, onToggle, showDate = false }: TaskItemProps) => {
  return (
    <li className={cn(
      "flex items-center gap-3 py-2 px-3 rounded-lg transition-colors",
      task.completed ? "bg-muted/30" : "hover:bg-muted/10"
    )}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 w-6 p-0 rounded-full"
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
      
      <span className={cn(
        "flex-1",
        task.completed && "line-through text-muted-foreground"
      )}>
        {task.title}
      </span>
      
      {showDate && (
        <span className="text-xs text-muted-foreground">
          {format(new Date(task.date), 'MMM d')}
        </span>
      )}
    </li>
  );
};

export default TodoList;
