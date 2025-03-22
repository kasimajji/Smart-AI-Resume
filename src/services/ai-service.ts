// src/services/ai-service.ts
import axios from 'axios';

export class AIService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Generate content using OpenAI's API
   * @param prompt The prompt to send to the AI
   * @returns The generated content
   */
  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer with expertise in crafting compelling, ATS-optimized content. Your goal is to help users create resumes that stand out while remaining professional and truthful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to generate content. Please check your API key and try again.');
    }
  }
  
  /**
   * Analyze resume for ATS compatibility
   * @param resumeText The text content of the resume
   * @param jobDescription Optional job description to match against
   * @returns Analysis results with suggestions
   */
  async analyzeAtsCompatibility(resumeText: string, jobDescription?: string): Promise<{
    score: number;
    suggestions: string[];
    keywordMatches?: { [key: string]: boolean };
  }> {
    try {
      const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility.
      
      Resume:
      ${resumeText}
      
      ${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}
      
      Please provide:
      1. An ATS compatibility score from 0-100
      2. A list of specific suggestions to improve ATS compatibility
      ${jobDescription ? '3. A list of key keywords from the job description and whether they appear in the resume' : ''}
      
      Format your response as JSON with the following structure:
      {
        "score": number,
        "suggestions": string[],
        "keywordMatches": object (optional)
      }`;
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in ATS (Applicant Tracking Systems) and resume optimization. You analyze resumes for ATS compatibility and provide actionable feedback. Your response should always be in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      const content = response.data.choices[0].message.content.trim();
      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing ATS compatibility:', error);
      throw new Error('Failed to analyze ATS compatibility. Please check your API key and try again.');
    }
  }
  
  /**
   * Generate a cover letter based on resume and job details
   * @param resumeData The resume data
   * @param jobDetails Details about the job being applied for
   * @returns Generated cover letter text
   */
  async generateCoverLetter(
    resumeData: any,
    jobDetails: {
      position: string;
      company: string;
      contactPerson?: string;
      jobDescription?: string;
    }
  ): Promise<string> {
    try {
      const prompt = `Generate a professional cover letter based on this resume information and job details:
      
      Resume Information:
      Name: ${resumeData.basics.name}
      Email: ${resumeData.basics.email}
      Phone: ${resumeData.basics.phone}
      Summary: ${resumeData.basics.summary}
      
      Most Recent Experience:
      ${resumeData.work.length > 0 
        ? `Position: ${resumeData.work[0].position}
      Company: ${resumeData.work[0].company}
      Description: ${resumeData.work[0].description}`
        : 'No experience provided'}
      
      Skills: ${resumeData.skills.map((s: any) => s.name).join(', ')}
      
      Job Details:
      Position: ${jobDetails.position}
      Company: ${jobDetails.company}
      ${jobDetails.contactPerson ? `Contact Person: ${jobDetails.contactPerson}` : ''}
      
      ${jobDetails.jobDescription 
        ? `Job Description:\n${jobDetails.jobDescription}`
        : ''}
      
      Please create a compelling, professional cover letter that:
      1. Has a formal letter format with date and address headers
      2. Includes a proper greeting (using the contact person name if provided)
      3. Has a strong opening paragraph that expresses interest in the position
      4. Contains 2-3 body paragraphs highlighting relevant skills and experiences
      5. Closes with a call to action and thank you
      6. Includes a formal signature
      
      The tone should be professional but conversational, and the letter should be no longer than one page.`;
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional cover letter writer with expertise in creating compelling, personalized cover letters that highlight a candidate\'s relevant skills and experiences. Your goal is to help users create cover letters that complement their resumes and increase their chances of getting interviews.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter. Please check your API key and try again.');
    }
  }
}