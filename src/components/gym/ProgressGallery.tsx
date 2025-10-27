
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { ProgressImage } from '@/lib/types';
import { Plus, Calendar, Image as ImageIcon, FileText, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ProgressGalleryProps {
  images: ProgressImage[];
  onAddImage: (image: Omit<ProgressImage, 'id'>) => void;
}

const ProgressGallery = ({ images, onAddImage }: ProgressGalleryProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<ProgressImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddImage = () => {
    if (!imagePreview) return;
    
    onAddImage({
      url: imagePreview,
      date: selectedDate,
      notes: notes
    });
    
    // Reset the form
    setImagePreview(null);
    setNotes('');
    setSelectedDate(new Date());
    setIsDialogOpen(false);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const sortedImages = [...images].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group images by month
  const groupedImages: Record<string, ProgressImage[]> = {};
  sortedImages.forEach(image => {
    const monthKey = format(new Date(image.date), 'MMMM yyyy');
    if (!groupedImages[monthKey]) {
      groupedImages[monthKey] = [];
    }
    groupedImages[monthKey].push(image);
  });
  
  // Navigation for image viewing
  const handleNavigateImage = (direction: 'prev' | 'next') => {
    if (!viewingImage) return;
    
    const currentIndex = sortedImages.findIndex(img => img.id === viewingImage.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? sortedImages.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === sortedImages.length - 1 ? 0 : currentIndex + 1;
    }
    
    setViewingImage(sortedImages[newIndex]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progress Photos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Progress Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="photo-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo-upload">Upload Photo</Label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
                    imagePreview ? "border-primary" : "border-muted"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-md" 
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG or GIF
                      </p>
                    </div>
                  )}
                  <Input 
                    ref={fileInputRef}
                    id="photo-upload" 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo-notes">Notes (Optional)</Label>
                <Textarea 
                  id="photo-notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="e.g., Weight: 165 lbs, feeling stronger this week"
                  className="h-24"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddImage}
                disabled={!imagePreview}
              >
                Add Photo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Image viewer dialog */}
        {viewingImage && (
          <Dialog 
            open={!!viewingImage} 
            onOpenChange={(open) => !open && setViewingImage(null)}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  Progress Photo - {format(new Date(viewingImage.date), 'MMMM d, yyyy')}
                </DialogTitle>
              </DialogHeader>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                  onClick={() => handleNavigateImage('prev')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={viewingImage.url} 
                  alt="Progress" 
                  className="max-h-[70vh] mx-auto rounded-md" 
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                  onClick={() => handleNavigateImage('next')}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              {viewingImage.notes && (
                <div className="bg-muted/30 p-4 rounded-md mt-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p>{viewingImage.notes}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {Object.keys(groupedImages).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedImages).map(([month, monthImages]) => (
            <div key={month} className="space-y-4">
              <h3 className="text-xl font-medium">{month}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthImages.map(image => (
                  <Card 
                    key={image.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setViewingImage(image)}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={image.url} 
                        alt={`Progress on ${format(new Date(image.date), 'MMM d, yyyy')}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                        <p className="text-white text-sm">
                          {format(new Date(image.date), 'MMMM d')}
                        </p>
                      </div>
                      
                      {image.notes && (
                        <div className="absolute top-2 right-2 h-6 w-6 bg-black/60 rounded-full flex items-center justify-center">
                          <FileText className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <ImageIcon className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <h3 className="text-lg font-medium text-muted-foreground mt-4">No progress photos yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Start tracking your fitness journey with photos
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus size={16} className="mr-1" /> Add Your First Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProgressGallery;
