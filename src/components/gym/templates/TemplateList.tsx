
import React, { useState } from 'react';
import { WorkoutTemplate } from '@/lib/types';
import { Plus, Search, Star, Copy, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutForm from '../workout/WorkoutForm';

interface TemplateListProps {
  templates: WorkoutTemplate[];
  onAddTemplate: (template: Omit<WorkoutTemplate, 'id'>) => void;
  onEditTemplate: (id: string, template: Partial<WorkoutTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onDuplicateTemplate: (id: string) => void;
  onCreateWorkoutFromTemplate: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onCreateWorkoutFromTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get unique categories
  const categories = ['All', ...new Set(templates.map(t => t.category || 'Uncategorized'))];
  
  // Filter templates based on search query and selected category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || 
      selectedCategory === 'All' || 
      (template.category || 'Uncategorized') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group templates by category for the "All" view
  const groupedTemplates = filteredTemplates.reduce<Record<string, WorkoutTemplate[]>>((acc, template) => {
    const category = template.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {});
  
  const toggleFavorite = (id: string, currentValue: boolean) => {
    onEditTemplate(id, { favorite: !currentValue });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workout Templates</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Workout Template</DialogTitle>
            </DialogHeader>
            
            <WorkoutForm 
              isTemplate
              onAddWorkout={(workout) => {
                const { startTime, endTime, completed, date, ...templateData } = workout;
                onAddTemplate(templateData as Omit<WorkoutTemplate, 'id'>);
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs 
          defaultValue="All" 
          value={selectedCategory || 'All'}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="bg-muted/50 p-1 h-auto flex flex-wrap justify-start overflow-x-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-sm py-1.5">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">No templates found matching your criteria</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Template
          </Button>
        </div>
      ) : selectedCategory === 'All' ? (
        <div className="space-y-8">
          {Object.entries(groupedTemplates).sort().map(([category, templates]) => (
            <div key={category}>
              <h3 className="text-lg font-medium mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template}
                    onToggleFavorite={() => toggleFavorite(template.id, !!template.favorite)}
                    onDuplicate={() => onDuplicateTemplate(template.id)}
                    onEdit={() => {/* Open edit dialog */}}
                    onDelete={() => onDeleteTemplate(template.id)}
                    onUse={() => onCreateWorkoutFromTemplate(template.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard 
              key={template.id} 
              template={template}
              onToggleFavorite={() => toggleFavorite(template.id, !!template.favorite)}
              onDuplicate={() => onDuplicateTemplate(template.id)}
              onEdit={() => {/* Open edit dialog */}}
              onDelete={() => onDeleteTemplate(template.id)}
              onUse={() => onCreateWorkoutFromTemplate(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TemplateCardProps {
  template: WorkoutTemplate;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUse: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onToggleFavorite,
  onDuplicate,
  onEdit,
  onDelete,
  onUse
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{template.name}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className={template.favorite ? "text-yellow-500" : "text-muted-foreground"}
            onClick={onToggleFavorite}
          >
            <Star className="h-4 w-4" fill={template.favorite ? "currentColor" : "none"} />
          </Button>
        </div>
        {template.category && (
          <CardDescription className="text-xs">{template.category}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        {template.description && (
          <p className="text-sm line-clamp-2 mb-3">{template.description}</p>
        )}
        
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Exercises:</p>
          <div className="flex flex-wrap gap-1">
            {template.exercises.slice(0, 3).map(exercise => (
              <span key={exercise.id} className="text-xs bg-muted px-2 py-1 rounded-full">
                {exercise.name}
              </span>
            ))}
            {template.exercises.length > 3 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                +{template.exercises.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex mt-4 gap-2 justify-between">
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={onEdit} className="px-2">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate} className="px-2">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="px-2 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" onClick={onUse}>Use Template</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateList;
