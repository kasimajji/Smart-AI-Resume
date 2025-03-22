// src/components/ats/AtsChecker.tsx
import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { AIService } from '../../services/ai-service';
import { AlertCircle, CheckCircle2, Upload, FileType } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface AtsCheckerProps {
  apiKey: string;
}

const AtsChecker: React.FC<AtsCheckerProps> = ({ apiKey }) => {
  const { resumeData } = useResumeStore();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    suggestions: string[];
    keywordMatches?: { [key: string]: boolean };
  } | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Convert resume data to text (simplified version)
  const convertResumeToText = () => {
    let text = '';
    
    // Basics
    text += `${resumeData.basics.name}\n`;
    text += `${resumeData.basics.email} | ${resumeData.basics.phone}\n`;
    if (resumeData.basics.location.city) {
      text += `${resumeData.basics.location.city}`;
      if (resumeData.basics.location.region) text += `, ${resumeData.basics.location.region}`;
      if (resumeData.basics.location.country) text += `, ${resumeData.basics.location.country}`;
      text += '\n';
    }
    if (resumeData.basics.website) text += `${resumeData.basics.website}\n`;
    
    // Summary
    if (resumeData.basics.summary) {
      text += '\nSUMMARY\n';
      text += `${resumeData.basics.summary}\n`;
    }
    
    // Work Experience
    if (resumeData.work.length > 0) {
      text += '\nEXPERIENCE\n';
      resumeData.work.forEach(work => {
        text += `${work.position}, ${work.company}\n`;
        text += `${work.startDate} - ${work.endDate || 'Present'}\n`;
        if (work.location) text += `${work.location}\n`;
        text += `${work.description}\n`;
        
        if (work.highlights.length > 0) {
          work.highlights.forEach(highlight => {
            text += `- ${highlight}\n`;
          });
        }
        text += '\n';
      });
    }
    
    // Education
    if (resumeData.education.length > 0) {
      text += '\nEDUCATION\n';
      resumeData.education.forEach(edu => {
        text += `${edu.studyType} in ${edu.area}, ${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.endDate}\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        text += '\n';
      });
    }
    
    // Skills
    if (resumeData.skills.length > 0) {
      text += '\nSKILLS\n';
      text += resumeData.skills.map(skill => skill.name).join(', ') + '\n';
    }
    
    // Add other sections as needed...
    
    return text;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    setResumeFile(file);
    
    // Simple file reader for text extraction
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setResumeText(event.target.result as string);
      }
    };
    
    // Read as text (this is a simplified approach; in a real app would need PDF parsing)
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide an OpenAI API key in the AI Enhancement section.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Get the text to analyze - either from uploaded file or current resume
      const textToAnalyze = resumeText || convertResumeToText();
      
      const aiService = new AIService(apiKey);
      const result = await aiService.analyzeAtsCompatibility(textToAnalyze, jobDescription);
      
      setAnalysisResult(result);
      
      toast({
        title: "ATS Analysis Complete",
        description: `Your resume received an ATS compatibility score of ${result.score}/100.`,
      });
    } catch (error) {
      console.error('Error analyzing ATS compatibility:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze ATS compatibility. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">ATS Compatibility Checker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume or Use Current</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Upload an existing resume or use your current one
                  </p>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button asChild variant="outline" className="mt-2">
                    <label htmlFor="resume-upload">Upload Resume</label>
                  </Button>
                  
                  {resumeFile && (
                    <div className="mt-4 flex items-center p-2 bg-gray-50 rounded-md">
                      <FileType className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="text-sm truncate">{resumeFile.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description (Recommended)</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here for more targeted analysis..."
                    className="min-h-32"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Adding a job description helps check if your resume contains relevant keywords.
                  </p>
                </div>
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!resumeText && resumeData.basics.name === '')}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze ATS Compatibility'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {analysisResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ATS Compatibility Score</span>
                  <span className={`text-lg ${
                    analysisResult.score >= 80 ? 'text-green-500' : 
                    analysisResult.score >= 60 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {analysisResult.score}/100
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Progress 
                      value={analysisResult.score} 
                      className={`h-2 ${
                        analysisResult.score >= 80 ? 'bg-green-100' : 
                        analysisResult.score >= 60 ? 'bg-amber-100' : 'bg-red-100'
                      }`}
                      indicatorClassName={
                        analysisResult.score >= 80 ? 'bg-green-500' : 
                        analysisResult.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }
                    />
                    
                    <p className="mt-2 text-sm text-gray-600">
                      {analysisResult.score >= 80 
                        ? 'Excellent! Your resume is well-optimized for ATS systems.'
                        : analysisResult.score >= 60 
                        ? 'Good start, but your resume could use some improvements for ATS.'
                        : 'Your resume needs significant improvements to pass ATS screening.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Suggestions for Improvement</h3>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {analysisResult.keywordMatches && (
                    <div>
                      <h3 className="font-medium mb-2">Keyword Matches</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(analysisResult.keywordMatches).map(([keyword, matches], index) => (
                          <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                            {matches ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className="text-sm">{keyword}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>ATS Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center text-gray-500">
                  <p>Upload a resume or use your current one and click "Analyze" to check ATS compatibility.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtsChecker;