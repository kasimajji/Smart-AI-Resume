// src/components/ai/ResumeAIEnhancer.tsx
import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sparkles, Zap, Target, UploadCloud, FileText } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from '../ui/use-toast';
import { AIService } from '../../services/ai-service';

interface AIEnhancerProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ResumeAIEnhancer: React.FC<AIEnhancerProps> = ({ apiKey, onApiKeyChange }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancementType, setEnhancementType] = useState('summary');
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(!apiKey);
  
  const { resumeData, updateBasics, updateWorkExperience } = useResumeStore();

  // Save API key
  const handleSaveApiKey = () => {
    onApiKeyChange(apiKeyInput);
    setApiKeyDialogOpen(false);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for this session.",
    });
  };

  // Generate Summary
  const handleGenerateSummary = async () => {
    if (!apiKey) {
      setApiKeyDialogOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      
      const aiService = new AIService(apiKey);
      const prompt = `Generate a professional summary for a resume based on the following information:
      
      Name: ${resumeData.basics.name}
      Current/Latest Position: ${resumeData.work[0]?.position || ''}
      Company: ${resumeData.work[0]?.company || ''}
      Skills: ${resumeData.skills.map(s => s.name).join(', ')}
      
      Job Description: ${jobDescription || 'Not provided'}
      
      Please write a concise, professional summary that highlights strengths and experience (4-5 sentences max).`;

      const summary = await aiService.generateContent(prompt);
      
      updateBasics({ summary });
      
      toast({
        title: "Summary Generated",
        description: "Your professional summary has been updated with AI-generated content.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Work Description
  const handleGenerateWorkDescription = async (workId: string) => {
    if (!apiKey) {
      setApiKeyDialogOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      
      const workItem = resumeData.work.find(w => w.id === workId);
      if (!workItem) return;
      
      const aiService = new AIService(apiKey);
      const prompt = `Generate a professional job description for a resume based on the following information:
      
      Position: ${workItem.position}
      Company: ${workItem.company}
      Time Period: ${workItem.startDate} to ${workItem.endDate || 'Present'}
      
      Job Description: ${jobDescription || 'Not provided'}
      
      Please write 3-4 sentences about the role and responsibilities, focusing on achievements and impact.`;

      const description = await aiService.generateContent(prompt);
      
      updateWorkExperience(workId, { description });
      
      toast({
        title: "Job Description Generated",
        description: "Your work experience description has been updated with AI-generated content.",
      });
    } catch (error) {
      console.error('Error generating work description:', error);
      toast({
        title: "Error",
        description: "Failed to generate job description. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Work Highlights
  const handleGenerateWorkHighlights = async (workId: string) => {
    if (!apiKey) {
      setApiKeyDialogOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      
      const workItem = resumeData.work.find(w => w.id === workId);
      if (!workItem) return;
      
      const aiService = new AIService(apiKey);
      const prompt = `Generate 3-5 bullet points highlighting achievements and responsibilities for a resume based on:
      
      Position: ${workItem.position}
      Company: ${workItem.company}
      Description: ${workItem.description}
      
      Job Description (if applying for a specific role): ${jobDescription || 'Not provided'}
      
      Please format each bullet point to start with a strong action verb and include specific achievements with metrics when possible.`;

      const highlightsText = await aiService.generateContent(prompt);
      
      // Split text into bullet points
      const highlights = highlightsText
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
      
      updateWorkExperience(workId, { highlights });
      
      toast({
        title: "Highlights Generated",
        description: "Your work experience highlights have been updated with AI-generated content.",
      });
    } catch (error) {
      console.error('Error generating work highlights:', error);
      toast({
        title: "Error",
        description: "Failed to generate highlights. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Job-Specific Recommendations
  const handleJobMatch = async () => {
    if (!apiKey || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide both an API key and job description.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const aiService = new AIService(apiKey);
      const prompt = `Analyze this resume against the provided job description and provide tailoring recommendations:
      
      Resume Summary: ${resumeData.basics.summary}
      
      Skills: ${resumeData.skills.map(s => s.name).join(', ')}
      
      Work Experience:
      ${resumeData.work.map(w => `- ${w.position} at ${w.company}: ${w.description}`).join('\n')}
      
      Job Description:
      ${jobDescription}
      
      Please provide 3-5 specific recommendations for how to tailor this resume to better match the job description. Focus on keywords, skills, and experiences that should be emphasized.`;

      const recommendations = await aiService.generateContent(prompt);
      
      // Display recommendations in a dialog
      toast({
        title: "Job Match Analysis Complete",
        description: recommendations,
        duration: 10000,
      });
    } catch (error) {
      console.error('Error generating job match:', error);
      toast({
        title: "Error",
        description: "Failed to analyze job match. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
            AI Resume Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here to tailor AI suggestions..."
              className="min-h-32"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Adding a job description helps the AI create more targeted content for your resume.
            </p>
          </div>
          
          <Tabs defaultValue="summary" onValueChange={setEnhancementType}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="summary">
                <FileText className="mr-2 h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="experience">
                <Zap className="mr-2 h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="jobMatch">
                <Target className="mr-2 h-4 w-4" />
                Job Match
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <div className="space-y-4">
                <p>Generate a professional summary that highlights your skills and experience.</p>
                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Professional Summary'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="experience">
              <div className="space-y-4">
                <p>Enhance your work experience entries with AI suggestions.</p>
                
                {resumeData.work.length > 0 ? (
                  <div className="space-y-4">
                    {resumeData.work.map((work) => (
                      <Card key={work.id} className="p-4">
                        <h3 className="font-medium">{work.position || 'Position'} at {work.company || 'Company'}</h3>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGenerateWorkDescription(work.id)}
                            disabled={isGenerating}
                          >
                            Generate Description
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGenerateWorkHighlights(work.id)}
                            disabled={isGenerating}
                          >
                            Generate Highlights
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Add work experience to your resume to use AI enhancement features.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="jobMatch">
              <div className="space-y-4">
                <p>
                  Analyze how well your resume matches the job description and get recommendations
                  for improvement. For best results, paste a full job description above.
                </p>
                <Button 
                  onClick={handleJobMatch} 
                  disabled={isGenerating || !jobDescription}
                  className="w-full"
                >
                  {isGenerating ? 'Analyzing...' : 'Analyze Job Match'}
                </Button>
                {!jobDescription && (
                  <p className="text-amber-500 text-sm">
                    Please add a job description to use this feature.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key Required</DialogTitle>
            <DialogDescription>
              To use AI features, you need to provide your own OpenAI API key. 
              This key will only be stored in your browser for this session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Don't have an API key? You can get one from the 
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                OpenAI platform
              </a>.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey} disabled={!apiKeyInput}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeAIEnhancer;