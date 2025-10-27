
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle, Download, Upload, Check } from 'lucide-react';
import { exportLocalStorageData, importLocalStorageData, STORAGE_KEYS } from '@/lib/localStorage';
import { useToast } from '@/hooks/use-toast';

const DataManagement: React.FC = () => {
  const [exportOptions, setExportOptions] = useState({
    workouts: true,
    templates: true,
    tasks: true,
    progressImages: true,
    nutrition: false,
    water: false
  });
  
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleExport = () => {
    const keysToExport: string[] = [];
    
    if (exportOptions.workouts) keysToExport.push(STORAGE_KEYS.WORKOUTS, STORAGE_KEYS.WORKOUT_STATISTICS);
    if (exportOptions.templates) keysToExport.push(STORAGE_KEYS.WORKOUT_TEMPLATES);
    if (exportOptions.tasks) keysToExport.push(STORAGE_KEYS.GYM_TASKS);
    if (exportOptions.progressImages) keysToExport.push(STORAGE_KEYS.PROGRESS_IMAGES);
    if (exportOptions.nutrition) keysToExport.push(STORAGE_KEYS.NUTRITION_ITEMS, STORAGE_KEYS.NUTRITION_GOALS);
    if (exportOptions.water) keysToExport.push(STORAGE_KEYS.WATER_INTAKE, STORAGE_KEYS.WATER_GOAL);
    
    const today = new Date();
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    exportLocalStorageData(keysToExport, `fitness-tracker-export-${dateString}.json`);
    
    toast({
      title: "Export Successful",
      description: "Your data has been exported successfully.",
    });
  };
  
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportSuccess(false);
    
    try {
      const importedData = await importLocalStorageData(file);
      console.log('Imported data:', Object.keys(importedData));
      
      setImportSuccess(true);
      toast({
        title: "Import Successful",
        description: `Successfully imported data (${Object.keys(importedData).length} items). Refresh the page to see your data.`,
        action: (
          <Button 
            onClick={() => window.location.reload()} 
            size="sm" 
            variant="outline"
          >
            Refresh
          </Button>
        ),
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Data Management</h2>
      </div>
      
      <Tabs defaultValue="export">
        <TabsList className="mb-6">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
              <CardDescription>
                Select which data you want to export. The file will be downloaded to your device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="workouts" 
                      checked={exportOptions.workouts}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, workouts: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="workouts" className="font-medium">Workouts</Label>
                      <p className="text-sm text-muted-foreground">Your workout history and progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="templates" 
                      checked={exportOptions.templates}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, templates: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="templates" className="font-medium">Workout Templates</Label>
                      <p className="text-sm text-muted-foreground">Your saved workout templates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="tasks" 
                      checked={exportOptions.tasks}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, tasks: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="tasks" className="font-medium">Gym Tasks</Label>
                      <p className="text-sm text-muted-foreground">Your gym-related to-do items</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="progressImages" 
                      checked={exportOptions.progressImages}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, progressImages: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="progressImages" className="font-medium">Progress Images</Label>
                      <p className="text-sm text-muted-foreground">Your progress photo gallery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="nutrition" 
                      checked={exportOptions.nutrition}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, nutrition: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="nutrition" className="font-medium">Nutrition Data</Label>
                      <p className="text-sm text-muted-foreground">Your food log and nutrition goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="water" 
                      checked={exportOptions.water}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, water: !!checked }))
                      }
                    />
                    <div className="space-y-1">
                      <Label htmlFor="water" className="font-medium">Water Tracking</Label>
                      <p className="text-sm text-muted-foreground">Your water intake records</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleExport} disabled={!Object.values(exportOptions).some(Boolean)} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Import your data from a previously exported file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed p-10 text-center">
                {importSuccess ? (
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Import Successful</h3>
                    <p className="text-muted-foreground mb-4">Your data has been imported successfully.</p>
                    <Button onClick={() => window.location.reload()}>
                      Refresh to See Changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Your Data File</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your JSON file or click to browse
                    </p>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImport}
                      className="hidden" 
                      ref={fileInputRef}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImporting}
                    >
                      {isImporting ? "Importing..." : "Select File"}
                    </Button>
                  </>
                )}
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Important:</strong> Importing data will overwrite your existing data. Make sure to export your current data first if you want to keep it.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagement;
