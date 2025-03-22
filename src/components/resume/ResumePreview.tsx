// src/components/resume/ResumePreview.tsx
import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent } from '../ui/card';
import { ResumeData } from '../../types/resume';
import { format } from 'date-fns';

// Resume Template Options
interface TemplateProps {
  data: ResumeData;
}

// Modern Template
const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="p-8 font-sans text-sm leading-snug">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{data.basics.name || 'Your Name'}</h1>
        <div className="flex justify-center gap-4 text-gray-600 flex-wrap">
          {data.basics.email && (
            <span>{data.basics.email}</span>
          )}
          {data.basics.phone && (
            <span>{data.basics.phone}</span>
          )}
          {data.basics.website && (
            <span>{data.basics.website}</span>
          )}
          {data.basics.location.city && (
            <span>
              {data.basics.location.city}
              {data.basics.location.region && `, ${data.basics.location.region}`}
              {data.basics.location.country && `, ${data.basics.location.country}`}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.basics.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Summary</h2>
          <p>{data.basics.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.work.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.work.map((work) => (
              <div key={work.id}>
                <div className="flex justify-between">
                  <h3 className="font-bold">{work.position}</h3>
                  <span className="text-gray-600">
                    {formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : 'Present'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">{work.company}</span>
                  {work.location && <span className="text-gray-600">{work.location}</span>}
                </div>
                <p className="mt-1 mb-2">{work.description}</p>
                {work.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {work.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="font-bold">{edu.studyType}, {edu.area}</h3>
                  <span className="text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <span className="font-semibold">{edu.institution}</span>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="mt-1">
                    <span className="font-semibold">Relevant Courses:</span> {edu.courses.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <div key={skill.id} className="bg-gray-100 rounded-md px-3 py-1">
                {skill.name}
                {skill.level && ` · ${skill.level}`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between">
                  <h3 className="font-bold">{project.name}</h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-gray-600">
                      {formatDate(project.startDate || '')} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                    </span>
                  )}
                </div>
                <p className="mt-1 mb-2">{project.description}</p>
                {project.url && (
                  <div className="text-blue-600">{project.url}</div>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {project.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards */}
      {data.awards.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Awards</h2>
          <div className="space-y-4">
            {data.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between">
                  <h3 className="font-bold">{award.title}</h3>
                  <span className="text-gray-600">{formatDate(award.date)}</span>
                </div>
                <span className="text-gray-600">Awarded by {award.awarder}</span>
                <p className="mt-1">{award.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1">Languages</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {data.languages.map((lang) => (
              <div key={lang.id}>
                <span className="font-semibold">{lang.language}</span>
                {lang.fluency && <span className="text-gray-600"> · {lang.fluency}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Classic Template
const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="p-8 font-serif text-sm leading-snug">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-800 pb-2">
        <h1 className="text-2xl font-bold uppercase text-center">{data.basics.name || 'Your Name'}</h1>
        <div className="flex justify-center gap-4 text-gray-600 flex-wrap mt-2">
          {data.basics.email && (
            <span>{data.basics.email}</span>
          )}
          {data.basics.phone && (
            <span>{data.basics.phone}</span>
          )}
          {data.basics.website && (
            <span>{data.basics.website}</span>
          )}
          {data.basics.location.city && (
            <span>
              {data.basics.location.city}
              {data.basics.location.region && `, ${data.basics.location.region}`}
              {data.basics.location.country && `, ${data.basics.location.country}`}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.basics.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2">Professional Summary</h2>
          <p>{data.basics.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.work.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2">Professional Experience</h2>
          <div className="space-y-4">
            {data.work.map((work) => (
              <div key={work.id}>
                <h3 className="font-bold">{work.position}, {work.company}</h3>
                <div className="flex justify-between text-gray-600">
                  <span>{work.location}</span>
                  <span>{formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : 'Present'}</span>
                </div>
                <p className="mt-1 mb-2">{work.description}</p>
                {work.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {work.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rest of the sections similar to Modern template but with different styling */}
      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-2">Education</h2>
          {/* Education content similar to above */}
        </div>
      )}

      {/* And so on for other sections */}
    </div>
  );
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM yyyy');
  } catch (error) {
    return dateString;
  }
};

// Main Resume Preview Component
const ResumePreview: React.FC = () => {
  const { resumeData } = useResumeStore();

  // Determine which template to render based on selected template
  const renderTemplate = () => {
    switch (resumeData.metadata.template) {
      case 'classic':
        return <ClassicTemplate data={resumeData} />;
      case 'modern':
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  return (
    <Card className="h-full w-full overflow-auto shadow-md">
      <CardContent className="p-0">
        <div className="bg-white w-full" style={{ 
          minHeight: '29.7cm', 
          width: '21cm',
          margin: '0 auto',
        }}>
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumePreview;