// src/components/resume/forms/WorkExperienceForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useResumeStore } from '../../../store/resumeStore';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../ui/accordion';

const workExpSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string(),
  location: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string()),
});

type WorkFormValues = z.infer<typeof workExpSchema>;

const WorkExperienceForm: React.FC = () => {
  const { resumeData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResumeStore();
  const [newHighlight, setNewHighlight] = React.useState('');
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
  
  const handleAddExperience = () => {
    addWorkExperience();
  };
  
  const handleRemoveExperience = (id: string) => {
    removeWorkExperience(id);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experience</CardTitle>
        <Button onClick={handleAddExperience} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </CardHeader>
      
      <CardContent>
        {resumeData.work.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No work experience added. Click 'Add Experience' to get started.</p>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={activeItemId || undefined}
            onValueChange={(value) => setActiveItemId(value)}
          >
            {resumeData.work.map((work) => (
              <AccordionItem key={work.id} value={work.id}>
                <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-md">
                  <div className="flex justify-between w-full pr-4">
                    <span className="font-medium">{work.position || 'New Position'}</span>
                    <span className="text-gray-500">{work.company || 'Company'}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <WorkExperienceFormItem 
                    work={work} 
                    onUpdate={updateWorkExperience} 
                    onRemove={handleRemoveExperience} 
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

interface WorkExperienceFormItemProps {
  work: ResumeData['work'][0];
  onUpdate: (id: string, data: Partial<ResumeData['work'][0]>) => void;
  onRemove: (id: string) => void;
}

const WorkExperienceFormItem: React.FC<WorkExperienceFormItemProps> = ({ 
  work, 
  onUpdate, 
  onRemove 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkFormValues>({
    resolver: zodResolver(workExpSchema),
    defaultValues: {
      company: work.company,
      position: work.position,
      startDate: work.startDate,
      endDate: work.endDate,
      location: work.location,
      description: work.description,
      highlights: work.highlights || [],
    },
  });
  
  const [highlights, setHighlights] = React.useState<string[]>(work.highlights || []);
  const [newHighlight, setNewHighlight] = React.useState('');
  
  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      const updatedHighlights = [...highlights, newHighlight.trim()];
      setHighlights(updatedHighlights);
      onUpdate(work.id, { highlights: updatedHighlights });
      setNewHighlight('');
    }
  };
  
  const handleRemoveHighlight = (index: number) => {
    const updatedHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(updatedHighlights);
    onUpdate(work.id, { highlights: updatedHighlights });
  };
  
  const onFormChange = handleSubmit((data) => {
    onUpdate(work.id, data);
  });
  
  return (
    <form onChange={onFormChange} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`company-${work.id}`}>Company</Label>
          <Input 
            id={`company-${work.id}`} 
            {...register('company')} 
          />
          {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`position-${work.id}`}>Position</Label>
          <Input 
            id={`position-${work.id}`} 
            {...register('position')} 
          />
          {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`startDate-${work.id}`}>Start Date</Label>
          <Input 
            id={`startDate-${work.id}`} 
            type="date"
            {...register('startDate')} 
          />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`endDate-${work.id}`}>End Date</Label>
          <Input 
            id={`endDate-${work.id}`} 
            type="date"
            {...register('endDate')} 
            placeholder="Present"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`location-${work.id}`}>Location (Optional)</Label>
          <Input 
            id={`location-${work.id}`} 
            {...register('location')} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`description-${work.id}`}>Job Description</Label>
        <Textarea 
          id={`description-${work.id}`} 
          {...register('description')} 
          className="min-h-24"
          placeholder="Describe your role and responsibilities..."
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>Key Achievements/Highlights</Label>
        
        <div className="flex gap-2">
          <Input 
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Add a key achievement..."
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddHighlight}
            variant="outline"
          >
            Add
          </Button>
        </div>
        
        <div className="space-y-2 mt-2">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <span>{highlight}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => handleRemoveHighlight(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          
          {highlights.length === 0 && (
            <p className="text-sm text-gray-400">No highlights added yet.</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="destructive" 
          onClick={() => onRemove(work.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Experience
        </Button>
      </div>
    </form>
  );
};

export default WorkExperienceForm;