"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemStorage = void 0;
class MemStorage {
    constructor() {
        this.education = [
            {
                id: 1,
                degree: "Bachelor of Science in Computer Science",
                institution: "University of Technology",
                location: "New York, NY",
                startYear: "2018",
                endYear: "2022",
                description: "Focused on software engineering, algorithms, and web development. Graduated Magna Cum Laude.",
                gpa: "3.8/4.0"
            },
            {
                id: 2,
                degree: "Master of Science in Software Engineering",
                institution: "Tech Institute",
                location: "San Francisco, CA",
                startYear: "2022",
                endYear: "2024",
                description: "Advanced studies in distributed systems, cloud computing, and AI/ML applications.",
                gpa: "3.9/4.0"
            }
        ];
        this.experience = [
            {
                id: 1,
                title: "Senior Full Stack Developer",
                company: "TechCorp Solutions",
                location: "San Francisco, CA",
                startDate: "2024-01",
                description: "Leading development of enterprise web applications using React, Node.js, and cloud technologies. Managing a team of 4 developers and architecting scalable solutions.",
                technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"],
                isCurrentJob: true
            },
            {
                id: 2,
                title: "Full Stack Developer",
                company: "StartupX",
                location: "Remote",
                startDate: "2022-06",
                endDate: "2023-12",
                description: "Built and maintained multiple web applications from concept to deployment. Implemented CI/CD pipelines and improved application performance by 40%.",
                technologies: ["React", "Express.js", "MongoDB", "Redis", "Kubernetes"],
                isCurrentJob: false
            },
            {
                id: 3,
                title: "Software Developer Intern",
                company: "InnovateTech",
                location: "Boston, MA",
                startDate: "2021-06",
                endDate: "2021-08",
                description: "Developed REST APIs and contributed to frontend development. Collaborated with senior developers on code reviews and system design.",
                technologies: ["JavaScript", "Python", "Flask", "MySQL"],
                isCurrentJob: false
            }
        ];
        this.projects = [
            {
                id: 1,
                title: "E-commerce Platform",
                description: "A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard. Built with modern web technologies and deployed on cloud infrastructure.",
                technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "AWS"],
                githubUrl: "https://github.com/johndoe/ecommerce-platform",
                liveUrl: "https://demo-ecommerce.example.com",
                featured: true
            },
            {
                id: 2,
                title: "Task Management App",
                description: "A collaborative task management application with real-time updates, team collaboration features, and advanced filtering options.",
                technologies: ["Vue.js", "Express.js", "Socket.io", "MongoDB"],
                githubUrl: "https://github.com/johndoe/task-manager",
                liveUrl: "https://taskmanager.example.com",
                featured: true
            },
            {
                id: 3,
                title: "Weather Dashboard",
                description: "A responsive weather dashboard that displays current conditions and forecasts for multiple cities with beautiful data visualizations.",
                technologies: ["React", "Chart.js", "OpenWeather API", "Tailwind CSS"],
                githubUrl: "https://github.com/johndoe/weather-dashboard",
                liveUrl: "https://weather-dash.example.com",
                featured: false
            },
            {
                id: 4,
                title: "Blog CMS",
                description: "A content management system for bloggers with markdown support, SEO optimization, and analytics integration.",
                technologies: ["Next.js", "Prisma", "PostgreSQL", "Vercel"],
                githubUrl: "https://github.com/johndoe/blog-cms",
                featured: false
            }
        ];
        this.blogPosts = [
            {
                id: 1,
                title: "Getting Started with React and TypeScript",
                slug: "getting-started-with-react-typescript",
                content: "TypeScript has become an essential tool for React developers. In this comprehensive guide, we'll explore how to set up a React project with TypeScript, understand the benefits it provides, and learn best practices for type-safe React development.\n\n## Why TypeScript with React?\n\nTypeScript brings static typing to JavaScript, which helps catch errors at compile time rather than runtime. When combined with React, it provides:\n\n- Better IDE support with autocomplete and refactoring\n- Catch prop type errors early\n- Self-documenting components\n- Improved maintainability\n\n## Setting Up the Project\n\nThe easiest way to start a React TypeScript project is using Create React App:\n\n```bash\nnpx create-react-app my-app --template typescript\n```\n\nThis sets up everything you need to get started with React and TypeScript.",
                excerpt: "Learn how to set up and use TypeScript with React for better development experience and type safety.",
                published: true,
                createdAt: new Date("2024-01-15"),
                updatedAt: new Date("2024-01-15"),
                tags: ["React", "TypeScript", "JavaScript", "Frontend"]
            },
            {
                id: 2,
                title: "Building Scalable APIs with Node.js",
                slug: "building-scalable-apis-nodejs",
                content: "Building scalable APIs is crucial for modern web applications. In this article, we'll explore best practices for creating robust, maintainable APIs using Node.js and Express.\n\n## API Design Principles\n\nWhen designing APIs, consider these key principles:\n\n1. **RESTful Design**: Follow REST conventions for predictable endpoints\n2. **Consistent Response Format**: Use a standard format for all responses\n3. **Error Handling**: Implement comprehensive error handling\n4. **Authentication**: Secure your endpoints appropriately\n5. **Rate Limiting**: Protect against abuse\n\n## Express.js Best Practices\n\nExpress.js is a minimal framework, but following these practices will help you build better APIs:\n\n- Use middleware for cross-cutting concerns\n- Implement proper error handling middleware\n- Use environment variables for configuration\n- Structure your routes logically",
                excerpt: "Best practices and patterns for building scalable and maintainable APIs using Node.js and Express.",
                published: true,
                createdAt: new Date("2024-01-10"),
                updatedAt: new Date("2024-01-10"),
                tags: ["Node.js", "API", "Backend", "Express"]
            }
        ];
        this.contactMessages = [];
        this.nextId = {
            education: 3,
            experience: 4,
            projects: 5,
            blogPosts: 3,
            contactMessages: 1
        };
    }
    async getEducation() {
        return [...this.education];
    }
    async addEducation(education) {
        const newEducation = {
            ...education,
            id: this.nextId.education++
        };
        this.education.push(newEducation);
        return newEducation;
    }
    async getExperience() {
        return [...this.experience];
    }
    async addExperience(experience) {
        const newExperience = {
            ...experience,
            id: this.nextId.experience++
        };
        this.experience.push(newExperience);
        return newExperience;
    }
    async getProjects() {
        return [...this.projects];
    }
    async getFeaturedProjects() {
        return this.projects.filter(p => p.featured);
    }
    async addProject(project) {
        const newProject = {
            ...project,
            id: this.nextId.projects++
        };
        this.projects.push(newProject);
        return newProject;
    }
    async getBlogPosts() {
        return [...this.blogPosts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async getPublishedBlogPosts() {
        return this.blogPosts
            .filter(post => post.published)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async getBlogPostBySlug(slug) {
        const post = this.blogPosts.find(p => p.slug === slug);
        return post || null;
    }
    async addBlogPost(blogPost) {
        const now = new Date();
        const newPost = {
            ...blogPost,
            id: this.nextId.blogPosts++,
            createdAt: now,
            updatedAt: now
        };
        this.blogPosts.push(newPost);
        return newPost;
    }
    async getContactMessages() {
        return [...this.contactMessages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async addContactMessage(message) {
        const newMessage = {
            ...message,
            id: this.nextId.contactMessages++,
            createdAt: new Date(),
            read: false
        };
        this.contactMessages.push(newMessage);
        return newMessage;
    }
}
exports.MemStorage = MemStorage;
