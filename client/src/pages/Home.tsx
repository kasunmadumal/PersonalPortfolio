import { useQuery } from '@tanstack/react-query';
import { Github, Linkedin, Mail, ExternalLink, Code2 } from 'lucide-react';
import { Link } from 'wouter';
import { Project } from '@shared/schema';

export default function Home() {
  const { data: featuredProjects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects/featured'],
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
            Full Stack Developer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Passionate about creating elegant solutions to complex problems. 
            I build scalable web applications with modern technologies and best practices.
          </p>
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://github.com/johndoe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={24} />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/johndoe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={24} />
              <span>LinkedIn</span>
            </a>
            <Link href="/contact">
              <span className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail size={24} />
                <span>Contact</span>
              </span>
            </Link>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/projects">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                View My Work
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors">
                Get In Touch
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'React', icon: '⚛️' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'TypeScript', icon: '🔷' },
              { name: 'PostgreSQL', icon: '🐘' },
              { name: 'AWS', icon: '☁️' },
              { name: 'Docker', icon: '🐳' },
              { name: 'Python', icon: '🐍' },
              { name: 'GraphQL', icon: '🔺' },
            ].map((skill) => (
              <div key={skill.name} className="text-center">
                <div className="text-4xl mb-2">{skill.icon}</div>
                <h3 className="font-semibold">{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Link href="/projects">
              <span className="text-primary hover:underline">View All Projects →</span>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 w-16 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Code2 size={16} />
                        <span>Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-lg text-muted-foreground mb-8">
            I'm always interested in new opportunities and challenging projects.
          </p>
          <Link href="/contact">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Start a Conversation
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}