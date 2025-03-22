// src/components/resume/forms/BasicsForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useResumeStore } from '../../../store/resumeStore';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';

const basicsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  region: z.string().optional(),
  country: z.string().optional(),
  summary: z.string().min(1, 'Summary is required'),
});

type BasicsFormValues = z.infer<typeof basicsSchema>;

const BasicsForm: React.FC = () => {
  const { resumeData, updateBasics } = useResumeStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<BasicsFormValues>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      name: resumeData.basics.name,
      email: resumeData.basics.email,
      phone: resumeData.basics.phone,
      website: resumeData.basics.website,
      city: resumeData.basics.location.city,
      region: resumeData.basics.location.region,
      country: resumeData.basics.location.country,
      summary: resumeData.basics.summary,
    },
  });

  const onSubmit = (data: BasicsFormValues) => {
    updateBasics({
      name: data.name,
      email: data.email,
      phone: data.phone,
      website: data.website,
      location: {
        city: data.city,
        region: data.region,
        country: data.country,
      },
      summary: data.summary,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onChange={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input id="website" {...register('website')} />
              {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">State/Region (optional)</Label>
              <Input id="region" {...register('region')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country (optional)</Label>
              <Input id="country" {...register('country')} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea 
              id="summary" 
              {...register('summary')} 
              className="min-h-32" 
              placeholder="Write a brief summary of your professional background and goals..."
            />
            {errors.summary && <p className="text-sm text-red-500">{errors.summary.message}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BasicsForm;