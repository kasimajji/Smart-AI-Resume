// src/types/resume.ts
export interface ResumeData {
    basics: {
      name: string;
      email: string;
      phone: string;
      website?: string;
      location: {
        address?: string;
        city: string;
        region?: string;
        postalCode?: string;
        country?: string;
      };
      profiles: {
        network: string;
        username: string;
        url: string;
      }[];
      summary: string;
    };
    work: {
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      location?: string;
      description: string;
      highlights: string[];
    }[];
    education: {
      id: string;
      institution: string;
      area: string;
      studyType: string;
      startDate: string;
      endDate: string;
      gpa?: string;
      courses?: string[];
    }[];
    skills: {
      id: string;
      name: string;
      level?: string;
      keywords?: string[];
    }[];
    projects: {
      id: string;
      name: string;
      description: string;
      startDate?: string;
      endDate?: string;
      url?: string;
      highlights?: string[];
    }[];
    awards: {
      id: string;
      title: string;
      date: string;
      awarder: string;
      summary: string;
    }[];
    languages: {
      id: string;
      language: string;
      fluency: string;
    }[];
    metadata: {
      lastModified: string;
      template: string;
      fontFamily: string;
    };
  }
  
 
  
  
  