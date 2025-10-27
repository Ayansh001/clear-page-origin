
import React, { useState } from 'react';
import { format } from 'date-fns';
import { WorkoutStatistics as WorkoutStatsType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WorkoutStatisticsProps {
  statistics: WorkoutStatsType;
}

const COLORS = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#ef4444'];

const WorkoutStatistics: React.FC<WorkoutStatisticsProps> = ({ statistics }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workout Statistics</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Workouts"
              value={statistics.totalWorkouts.toString()}
              description={`${statistics.completedWorkouts} completed (${Math.round((statistics.completedWorkouts / statistics.totalWorkouts) * 100) || 0}%)`}
            />
            
            <StatCard
              title="Total Exercises"
              value={statistics.totalExercises.toString()}
              description={`${(statistics.totalExercises / statistics.totalWorkouts).toFixed(1)} per workout`}
            />
            
            <StatCard
              title="Set Completion"
              value={`${Math.round((statistics.completedSets / statistics.totalSets) * 100) || 0}%`}
              description={`${statistics.completedSets}/${statistics.totalSets} sets`}
              showProgress
              progressValue={(statistics.completedSets / statistics.totalSets) * 100}
            />
            
            <StatCard
              title="Total Volume"
              value={`${statistics.totalVolume.toLocaleString()} kg`}
              description="Weight × reps across all workouts"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Workout Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statistics.weeklySummary.map(week => ({
                    week: week.week.split('-')[1],
                    workouts: week.workouts,
                    volume: Math.round(week.volume / 1000), // Convert to tons for better display
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'volume') return [`${value} tons`, 'Volume'];
                      return [value, 'Workouts'];
                    }} 
                    labelFormatter={(label) => `Week ${label}`}
                  />
                  <Bar yAxisId="left" dataKey="workouts" fill="#8884d8" name="Workouts" />
                  <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" name="Volume (tons)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statistics.weeklySummary.map(week => ({
                    week: week.week.split('-')[1],
                    volume: week.volume,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Volume']} 
                    labelFormatter={(label) => `Week ${label}`}
                  />
                  <Bar dataKey="volume" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Workout Duration</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <span className="text-5xl font-bold">{statistics.averageWorkoutDuration}</span>
                <p className="text-muted-foreground">minutes per workout</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Frequent Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistics.mostFrequentExercises.map((exercise, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{exercise.name}</span>
                      <span className="font-medium">{exercise.count} times</span>
                    </div>
                    <Progress value={(exercise.count / statistics.mostFrequentExercises[0].count) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workouts by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statistics.workoutsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                    >
                      {statistics.workoutsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [`${value} workouts`, props.payload.category]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 space-y-3">
                {statistics.workoutsByCategory.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span>{category.category}: {category.count} workouts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  showProgress?: boolean;
  progressValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, showProgress, progressValue }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {showProgress && progressValue !== undefined && (
          <Progress value={progressValue} className="h-1.5 mt-2" />
        )}
        <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
      </CardContent>
    </Card>
  );
};

export default WorkoutStatistics;
