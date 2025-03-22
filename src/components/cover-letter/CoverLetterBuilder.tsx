// src/components/cover-letter/CoverLetterBuilder.tsx
import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sparkles, Download, Copy, FileText } from 'lucide-react';
import { AIService } from '../../services/ai-service';
import { toast } from '../ui/use-toast';

interface CoverLetterBuilderProps {
  apiKey: string;
}

const CoverLetterBuilder: React.FC<CoverLetterBuilderProps> = ({ apiKey }) => {
  const { resumeData } = useResumeStore();
  
  const [jobDetails, setJobDetails] = useState({
    position: '',
    company: '',
    contactPerson: '',
    jobDescription: '',
  });
  
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide an OpenAI API key in the settings.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDetails.position || !jobDetails.company) {
      toast({
        title: "Missing Information",
        description: "Please provide at least the job position and company name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const aiService = new AIService(apiKey);
      const coverLetter = await aiService.generateCoverLetter(resumeData, jobDetails);
      
      setCoverLetterContent(coverLetter);
      
      toast({
        title: "Cover Letter Generated",
        description: "Your cover letter has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate cover letter. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetterContent);
    toast({
      title: "Copied to Clipboard",
      description: "Cover letter content has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetterContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${jobDetails.company.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Cover Letter Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Job Position*</Label>
                  <Input
                    id="position"
                    name="position"
                    value={jobDetails.position}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name*</Label>
                  <Input
                    id="company"
                    name="company"
                    value={jobDetails.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person (Optional)</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={jobDetails.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. Jane Smith, Hiring Manager"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={jobDetails.jobDescription}
                    onChange={handleInputChange}
                    placeholder="Paste the job description here for a more tailored cover letter..."
                    className="min-h-32"
                  />
                  <p className="text-sm text-gray-500">
                    Adding the job description will significantly improve the quality and relevance of your cover letter.
                  </p>
                </div>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobDetails.position || !jobDetails.company}
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center justify-between">
                <span>Cover Letter Preview</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    disabled={!coverLetterContent}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    disabled={!coverLetterContent}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {coverLetterContent ? (
                <div className="whitespace-pre-line bg-white p-4 rounded border min-h-[500px]">
                  {coverLetterContent}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500 h-full">
                  <FileText className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="mb-2">Your cover letter will appear here</p>
                  <p className="text-sm">Fill in the job details and click "Generate Cover Letter"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;