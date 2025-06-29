import { useQuery } from '@tanstack/react-query';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Education } from '@shared/schema';

export default function EducationPage() {
  const { data: education = [], isLoading } = useQuery<Education[]>({
    queryKey: ['/api/education'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8"></div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 mb-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center">
          <GraduationCap className="mr-3" size={36} />
          Education
        </h1>
        
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {edu.degree}
                  </h2>
                  <h3 className="text-lg text-primary font-medium mb-2">
                    {edu.institution}
                  </h3>
                </div>
                {edu.gpa && (
                  <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded">
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {edu.location}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {edu.startYear} - {edu.endYear || 'Present'}
                </div>
              </div>
              
              {edu.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}