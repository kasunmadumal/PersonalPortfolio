import { useQuery } from '@tanstack/react-query';
import { Briefcase, MapPin, Calendar, Clock } from 'lucide-react';
import { Experience } from '@shared/schema';

export default function ExperiencePage() {
  const { data: experience = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['/api/experience'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 mb-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-6 w-16 bg-muted rounded"></div>
                ))}
              </div>
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
          <Briefcase className="mr-3" size={36} />
          Professional Experience
        </h1>
        
        <div className="space-y-8">
          {experience.map((exp) => (
            <div key={exp.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {exp.title}
                  </h2>
                  <h3 className="text-lg text-primary font-medium mb-2">
                    {exp.company}
                  </h3>
                </div>
                {exp.isCurrentJob && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded">
                    <Clock size={16} className="mr-1" />
                    Current Position
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {exp.location}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                {exp.description}
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}