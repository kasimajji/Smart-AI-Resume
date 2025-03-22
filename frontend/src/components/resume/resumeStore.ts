 // src/store/resumeStore.ts
 import { create } from 'zustand';
 import { persist } from 'zustand/middleware';
 import { v4 as uuidv4 } from 'uuid';
 import { ResumeData } from '../types/resume';
 
 interface ResumeState {
   resumeData: ResumeData;
   activeSection: string;
   setActiveSection: (section: string) => void;
   updateBasics: (basics: Partial<ResumeData['basics']>) => void;
   addWorkExperience: () => void;
   updateWorkExperience: (id: string, workExp: Partial<ResumeData['work'][0]>) => void;
   removeWorkExperience: (id: string) => void;
   addEducation: () => void;
   updateEducation: (id: string, education: Partial<ResumeData['education'][0]>) => void;
   removeEducation: (id: string) => void;
   addSkill: () => void;
   updateSkill: (id: string, skill: Partial<ResumeData['skills'][0]>) => void;
   removeSkill: (id: string) => void;
   addProject: () => void;
   updateProject: (id: string, project: Partial<ResumeData['projects'][0]>) => void;
   removeProject: (id: string) => void;
   addAward: () => void;
   updateAward: (id: string, award: Partial<ResumeData['awards'][0]>) => void;
   removeAward: (id: string) => void;
   addLanguage: () => void;
   updateLanguage: (id: string, language: Partial<ResumeData['languages'][0]>) => void;
   removeLanguage: (id: string) => void;
   updateMetadata: (metadata: Partial<ResumeData['metadata']>) => void;
   resetResume: () => void;
 }
 
 const initialResumeData: ResumeData = {
   basics: {
     name: '',
     email: '',
     phone: '',
     website: '',
     location: {
       address: '',
       city: '',
       region: '',
       postalCode: '',
       country: '',
     },
     profiles: [],
     summary: '',
   },
   work: [],
   education: [],
   skills: [],
   projects: [],
   awards: [],
   languages: [],
   metadata: {
     lastModified: new Date().toISOString(),
     template: 'modern',
     fontFamily: 'Inter',
   },
 };
 
 export const useResumeStore = create<ResumeState>()(
   persist(
     (set) => ({
       resumeData: initialResumeData,
       activeSection: 'basics',
       
       setActiveSection: (section) => set({ activeSection: section }),
       
       updateBasics: (basics) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           basics: {
             ...state.resumeData.basics,
             ...basics,
           },
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       addWorkExperience: () => set((state) => ({
         resumeData: {
           ...state.resumeData,
           work: [
             ...state.resumeData.work,
             {
               id: uuidv4(),
               company: '',
               position: '',
               startDate: '',
               endDate: '',
               location: '',
               description: '',
               highlights: [],
             },
           ],
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       updateWorkExperience: (id, workExp) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           work: state.resumeData.work.map((work) =>
             work.id === id ? { ...work, ...workExp } : work
           ),
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       removeWorkExperience: (id) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           work: state.resumeData.work.filter((work) => work.id !== id),
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       // Similar functions for education, skills, projects, awards, and languages
       addEducation: () => set((state) => ({
         resumeData: {
           ...state.resumeData,
           education: [
             ...state.resumeData.education,
             {
               id: uuidv4(),
               institution: '',
               area: '',
               studyType: '',
               startDate: '',
               endDate: '',
               gpa: '',
               courses: [],
             },
           ],
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       updateEducation: (id, education) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           education: state.resumeData.education.map((edu) =>
             edu.id === id ? { ...edu, ...education } : edu
           ),
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       removeEducation: (id) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           education: state.resumeData.education.filter((edu) => edu.id !== id),
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
 
       // Implementation for other sections follows the same pattern
       // Implementing only skills section for brevity
       addSkill: () => set((state) => ({
         resumeData: {
           ...state.resumeData,
           skills: [
             ...state.resumeData.skills,
             {
               id: uuidv4(),
               name: '',
               level: '',
               keywords: [],
             },
           ],
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       updateSkill: (id, skill) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           skills: state.resumeData.skills.map((s) =>
             s.id === id ? { ...s, ...skill } : s
           ),
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       removeSkill: (id) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           skills: state.resumeData.skills.filter((s) => s.id !== id),
           metadata: {
             ...state.resumeData.metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       // Projects, Awards, and Languages sections follow the same pattern
       // Implementing placeholder functions to satisfy the interface
       addProject: () => {},
       updateProject: () => {},
       removeProject: () => {},
       addAward: () => {},
       updateAward: () => {},
       removeAward: () => {},
       addLanguage: () => {},
       updateLanguage: () => {},
       removeLanguage: () => {},
       
       updateMetadata: (metadata) => set((state) => ({
         resumeData: {
           ...state.resumeData,
           metadata: {
             ...state.resumeData.metadata,
             ...metadata,
             lastModified: new Date().toISOString(),
           },
         },
       })),
       
       resetResume: () => set({ resumeData: initialResumeData }),
     }),
     {
       name: 'resume-storage',
     }
   )
 );
 