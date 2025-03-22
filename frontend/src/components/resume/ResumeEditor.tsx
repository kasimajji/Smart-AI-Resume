// src/components/resume/ResumeEditor.tsx
  import React from 'react';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
  import { useResumeStore } from '../../store/resumeStore';
  import BasicsForm from './forms/BasicsForm';
  import WorkExperienceForm from './forms/WorkExperienceForm';
  import EducationForm from './forms/EducationForm';
  import SkillsForm from './forms/SkillsForm';
  import ProjectsForm from './forms/ProjectsForm';
  import AwardsForm from './forms/AwardsForm';
  import LanguagesForm from './forms/LanguagesForm';
  
  const ResumeEditor: React.FC = () => {
    const { activeSection, setActiveSection } = useResumeStore();
  
    return (
      <div className="w-full max-w-3xl p-4 bg-white rounded-lg shadow-md">
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="work">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics">
            <BasicsForm />
          </TabsContent>
          
          <TabsContent value="work">
            <WorkExperienceForm />
          </TabsContent>
          
          <TabsContent value="education">
            <EducationForm />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsForm />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsForm />
          </TabsContent>
          
          <TabsContent value="awards">
            <AwardsForm />
          </TabsContent>
          
          <TabsContent value="languages">
            <LanguagesForm />
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  export default ResumeEditor;