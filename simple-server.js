const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Sample data
const education = [
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

const experience = [
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
  }
];

const projects = [
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
  }
];

let blogPosts = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-with-react-typescript",
    content: "TypeScript has become an essential tool for React developers. In this comprehensive guide, we'll explore how to set up a React project with TypeScript...",
    excerpt: "Learn how to set up and use TypeScript with React for better development experience and type safety.",
    published: true,
    createdAt: new Date("2024-01-15"),
    tags: ["React", "TypeScript", "JavaScript", "Frontend"]
  }
];

let contactMessages = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/education', (req, res) => {
  res.json(education);
});

app.get('/api/experience', (req, res) => {
  res.json(experience);
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects/featured', (req, res) => {
  res.json(projects.filter(p => p.featured));
});

app.get('/api/blog', (req, res) => {
  res.json(blogPosts.filter(p => p.published));
});

app.get('/api/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json(post);
});

app.post('/api/blog/upload', upload.single('docx'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // For demo purposes, create a simple blog post
    const title = req.file.originalname.replace('.docx', '');
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    
    const newPost = {
      id: blogPosts.length + 1,
      title: title,
      slug: slug,
      content: `This is a blog post created from the uploaded DOCX file: ${req.file.originalname}. The content would normally be extracted from the document.`,
      excerpt: `Blog post created from ${req.file.originalname}`,
      published: false,
      createdAt: new Date(),
      tags: ['Upload', 'Demo']
    };

    blogPosts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process document' });
  }
});

app.post('/api/contact', (req, res) => {
  const message = {
    id: contactMessages.length + 1,
    ...req.body,
    createdAt: new Date(),
    read: false
  };
  contactMessages.push(message);
  res.status(201).json(message);
});

app.get('/api/contact', (req, res) => {
  res.json(contactMessages);
});

// Serve main page
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portfolio Website - Full Stack Developer</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6; 
                color: #333; 
                background: #f8fafc;
            }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            .header { 
                background: white; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                margin-bottom: 40px; 
                border-radius: 10px;
                padding: 30px;
                text-align: center;
            }
            .nav { margin: 30px 0; }
            .nav a { 
                margin: 0 15px; 
                text-decoration: none; 
                color: #3b82f6; 
                font-weight: 500;
                padding: 8px 16px;
                border-radius: 6px;
                transition: all 0.2s;
            }
            .nav a:hover { background: #eff6ff; }
            .section { 
                background: white;
                margin-bottom: 30px; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            h1 { color: #1e293b; font-size: 2.5em; margin-bottom: 10px; }
            h2 { color: #3b82f6; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
            .hero h1 { color: white; }
            .hero p { font-size: 1.2em; opacity: 0.9; margin: 20px 0; }
            .skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .skill { background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; }
            .upload-form { 
                background: #f8fafc; 
                padding: 20px; 
                border-radius: 8px; 
                border: 2px dashed #cbd5e1;
                text-align: center;
            }
            .btn { 
                background: #3b82f6; 
                color: white; 
                padding: 12px 24px; 
                border: none; 
                border-radius: 6px; 
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            }
            .btn:hover { background: #2563eb; }
            input[type="file"] { margin: 10px; }
            .api-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .api-link { 
                background: #eff6ff; 
                padding: 15px; 
                border-radius: 8px; 
                border-left: 4px solid #3b82f6;
            }
            .api-link a { 
                color: #1e40af; 
                text-decoration: none; 
                font-weight: 500;
            }
            .api-link a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header hero">
                <h1>Portfolio Website</h1>
                <p>Full Stack Developer | React & Node.js Expert</p>
                <div class="nav">
                    <a href="#education">Education</a>
                    <a href="#experience">Experience</a>
                    <a href="#projects">Projects</a>
                    <a href="#blog">Blog</a>
                    <a href="#contact">Contact</a>
                </div>
            </div>
            
            <div class="section" id="education">
                <h2>🎓 Education</h2>
                <div id="education-data">Loading education data...</div>
            </div>
            
            <div class="section" id="experience">
                <h2>💼 Professional Experience</h2>
                <div id="experience-data">Loading experience data...</div>
            </div>
            
            <div class="section" id="projects">
                <h2>🚀 Featured Projects</h2>
                <div id="projects-data">Loading projects data...</div>
            </div>
            
            <div class="section" id="blog">
                <h2>📝 Blog</h2>
                <div id="blog-data">Loading blog posts...</div>
                
                <h3 style="margin-top: 30px;">Upload New Article</h3>
                <div class="upload-form">
                    <p>Upload a DOCX file to create a new blog post</p>
                    <form action="/api/blog/upload" method="post" enctype="multipart/form-data">
                        <input type="file" name="docx" accept=".docx" required>
                        <br>
                        <button type="submit" class="btn">Upload Article</button>
                    </form>
                </div>
            </div>
            
            <div class="section">
                <h2>🔗 API Endpoints</h2>
                <div class="api-links">
                    <div class="api-link">
                        <a href="/api/education">Education API</a>
                        <p>Academic background and qualifications</p>
                    </div>
                    <div class="api-link">
                        <a href="/api/experience">Experience API</a>
                        <p>Professional work history</p>
                    </div>
                    <div class="api-link">
                        <a href="/api/projects">Projects API</a>
                        <p>Portfolio projects and demos</p>
                    </div>
                    <div class="api-link">
                        <a href="/api/blog">Blog API</a>
                        <p>Published blog articles</p>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Load education data
            fetch('/api/education')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(edu => \`
                        <div style="background: #f1f5f9; padding: 20px; margin: 15px 0; border-radius: 8px;">
                            <h3>\${edu.degree}</h3>
                            <p><strong>\${edu.institution}</strong> - \${edu.location}</p>
                            <p>\${edu.startYear} - \${edu.endYear || 'Present'}</p>
                            \${edu.gpa ? \`<p>GPA: \${edu.gpa}</p>\` : ''}
                            \${edu.description ? \`<p>\${edu.description}</p>\` : ''}
                        </div>
                    \`).join('');
                    document.getElementById('education-data').innerHTML = html;
                });

            // Load experience data
            fetch('/api/experience')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(exp => \`
                        <div style="background: #f1f5f9; padding: 20px; margin: 15px 0; border-radius: 8px;">
                            <h3>\${exp.title}</h3>
                            <p><strong>\${exp.company}</strong> - \${exp.location}</p>
                            <p>\${exp.startDate} - \${exp.endDate || 'Present'}</p>
                            <p>\${exp.description}</p>
                            <div style="margin-top: 10px;">
                                \${exp.technologies.map(tech => \`<span style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">\${tech}</span>\`).join('')}
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('experience-data').innerHTML = html;
                });

            // Load featured projects
            fetch('/api/projects/featured')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(project => \`
                        <div style="background: #f1f5f9; padding: 20px; margin: 15px 0; border-radius: 8px;">
                            <h3>\${project.title}</h3>
                            <p>\${project.description}</p>
                            <div style="margin: 10px 0;">
                                \${project.technologies.map(tech => \`<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">\${tech}</span>\`).join('')}
                            </div>
                            <div style="margin-top: 15px;">
                                \${project.githubUrl ? \`<a href="\${project.githubUrl}" target="_blank" style="margin-right: 15px; color: #3b82f6;">GitHub</a>\` : ''}
                                \${project.liveUrl ? \`<a href="\${project.liveUrl}" target="_blank" style="color: #10b981;">Live Demo</a>\` : ''}
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('projects-data').innerHTML = html;
                });

            // Load blog posts
            fetch('/api/blog')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(post => \`
                        <div style="background: #f1f5f9; padding: 20px; margin: 15px 0; border-radius: 8px;">
                            <h3>\${post.title}</h3>
                            <p style="color: #6b7280; font-size: 14px;">Published: \${new Date(post.createdAt).toLocaleDateString()}</p>
                            <p>\${post.excerpt}</p>
                            \${post.tags ? \`<div style="margin-top: 10px;">\${post.tags.map(tag => \`<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">\${tag}</span>\`).join('')}</div>\` : ''}
                        </div>
                    \`).join('');
                    document.getElementById('blog-data').innerHTML = html || '<p>No published blog posts yet.</p>';
                });
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Portfolio website running on http://0.0.0.0:${PORT}`);
  console.log(`📊 API endpoints available at http://0.0.0.0:${PORT}/api`);
  console.log(`📝 Upload DOCX files to create blog posts`);
});