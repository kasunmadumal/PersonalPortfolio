const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only DOCX files are allowed'), false);
    }
  }
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
    description: "A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "AWS"],
    githubUrl: "https://github.com/johndoe/ecommerce-platform",
    liveUrl: "https://demo-ecommerce.example.com",
    featured: true
  },
  {
    id: 2, 
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team collaboration features.",
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
    content: "TypeScript has become an essential tool for React developers. In this guide, we explore setup and best practices.",
    excerpt: "Learn how to set up and use TypeScript with React for better development experience.",
    published: true,
    createdAt: new Date("2024-01-15"),
    tags: ["React", "TypeScript", "Frontend"]
  }
];

let contactMessages = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/education', (req, res) => res.json(education));
app.get('/api/experience', (req, res) => res.json(experience));
app.get('/api/projects', (req, res) => res.json(projects));
app.get('/api/projects/featured', (req, res) => res.json(projects.filter(p => p.featured)));
app.get('/api/blog', (req, res) => res.json(blogPosts.filter(p => p.published)));

app.get('/api/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  post ? res.json(post) : res.status(404).json({ error: 'Blog post not found' });
});

app.post('/api/blog/upload', upload.single('docx'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Extract text from DOCX file using mammoth
    const result = await mammoth.extractRawText({ path: req.file.path });
    const extractedText = result.value;
    
    // Get title from filename or first line of content
    let title = req.file.originalname.replace('.docx', '').replace(/[-_]/g, ' ');
    const firstLine = extractedText.split('\n')[0];
    if (firstLine && firstLine.length > 0 && firstLine.length < 100) {
      title = firstLine.trim();
    }
    
    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    // Create excerpt from first 200 characters
    const excerpt = extractedText.substring(0, 200).trim() + '...';
    
    // Create new blog post
    const newPost = {
      id: blogPosts.length + 1,
      title,
      slug,
      content: extractedText,
      excerpt,
      published: false,
      createdAt: new Date(),
      tags: ['Article', 'Upload'],
      filePath: req.file.path,
      originalFileName: req.file.originalname
    };

    blogPosts.push(newPost);
    
    console.log(`New blog post created: "${title}" from file: ${req.file.originalname}`);
    
    res.status(201).json({
      message: 'Article created successfully from DOCX file',
      post: newPost,
      extractedLength: extractedText.length
    });
    
  } catch (error) {
    console.error('Error processing DOCX file:', error);
    
    // Clean up uploaded file if processing failed
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process DOCX file',
      details: error.message 
    });
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

app.get('/api/contact', (req, res) => res.json(contactMessages));

// Get all blog posts including drafts (admin endpoint)
app.get('/api/blog/admin', (req, res) => {
  const postsWithFileInfo = blogPosts.map(post => {
    const fileExists = post.filePath ? fs.existsSync(post.filePath) : false;
    return {
      ...post,
      fileExists,
      wordCount: post.content ? post.content.split(/\s+/).length : 0
    };
  });
  res.json(postsWithFileInfo);
});

// Publish/unpublish blog post
app.patch('/api/blog/:id/publish', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = blogPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  
  post.published = !post.published;
  res.json({ 
    message: `Post ${post.published ? 'published' : 'unpublished'} successfully`,
    post 
  });
});

// Delete blog post and its file
app.delete('/api/blog/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = blogPosts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  
  const post = blogPosts[postIndex];
  
  // Delete the uploaded file if it exists
  if (post.filePath && fs.existsSync(post.filePath)) {
    try {
      fs.unlinkSync(post.filePath);
      console.log(`Deleted file: ${post.filePath}`);
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
    }
  }
  
  // Remove from blog posts array
  blogPosts.splice(postIndex, 1);
  
  res.json({ 
    message: 'Blog post and associated file deleted successfully',
    deletedPost: post
  });
});

// Main page
app.get('/', (req, res) => {
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
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6; 
                color: #333; 
                background: #f8fafc;
            }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            .hero { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                text-align: center; 
                padding: 60px 30px;
                border-radius: 15px;
                margin-bottom: 40px;
            }
            .hero h1 { font-size: 3em; margin-bottom: 15px; }
            .hero p { font-size: 1.3em; opacity: 0.9; }
            .section { 
                background: white;
                margin-bottom: 30px; 
                padding: 30px; 
                border-radius: 15px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            h2 { color: #3b82f6; margin-bottom: 25px; font-size: 1.8em; }
            .item { 
                background: #f8fafc; 
                padding: 25px; 
                margin: 20px 0; 
                border-radius: 10px; 
                border-left: 4px solid #3b82f6;
            }
            .item h3 { color: #1e293b; margin-bottom: 10px; }
            .tech-tag { 
                background: #3b82f6; 
                color: white; 
                padding: 6px 12px; 
                border-radius: 20px; 
                margin: 3px; 
                display: inline-block; 
                font-size: 13px;
            }
            .upload-area { 
                background: #f1f5f9; 
                padding: 30px; 
                border: 3px dashed #cbd5e1;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .btn { 
                background: #3b82f6; 
                color: white; 
                padding: 12px 25px; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
                font-size: 16px;
                margin: 10px;
            }
            .btn:hover { background: #2563eb; }
            .api-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                gap: 20px; 
                margin: 20px 0;
            }
            .api-card { 
                background: #eff6ff; 
                padding: 20px; 
                border-radius: 10px; 
                border-left: 4px solid #3b82f6;
            }
            .api-card a { color: #1e40af; text-decoration: none; font-weight: 600; }
            .api-card a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="hero">
                <h1>Portfolio Website</h1>
                <p>Full Stack Developer | React & Node.js Expert</p>
            </div>
            
            <div class="section">
                <h2>🎓 Education</h2>
                <div id="education-content">Loading education data...</div>
            </div>
            
            <div class="section">
                <h2>💼 Professional Experience</h2>
                <div id="experience-content">Loading experience data...</div>
            </div>
            
            <div class="section">
                <h2>🚀 Featured Projects</h2>
                <div id="projects-content">Loading projects data...</div>
            </div>
            
            <div class="section">
                <h2>📝 Blog</h2>
                <div id="blog-content">Loading blog posts...</div>
                
                <h3 style="margin-top: 30px;">Upload New Article</h3>
                <div class="upload-area">
                    <p><strong>Upload DOCX files to automatically create blog posts</strong></p>
                    <p style="font-size: 14px; color: #666; margin: 10px 0;">
                        • Files are saved to: <code>/uploads/</code> directory<br>
                        • Text content is extracted using Mammoth library<br>
                        • Posts are created as drafts (unpublished by default)<br>
                        • Article title comes from filename or first line of content
                    </p>
                    <form action="/api/blog/upload" method="post" enctype="multipart/form-data" id="upload-form">
                        <input type="file" name="docx" accept=".docx" required class="btn" id="file-input">
                        <button type="submit" class="btn">Upload & Process DOCX</button>
                    </form>
                    <div id="upload-status" style="margin-top: 15px;"></div>
                </div>
                
                <h3 style="margin-top: 30px;">Blog Management</h3>
                <div id="admin-blog-content">
                    <p>Loading blog management panel...</p>
                </div>
            </div>
            
            <div class="section">
                <h2>🔗 API Endpoints</h2>
                <div class="api-grid">
                    <div class="api-card">
                        <a href="/api/education">Education API</a>
                        <p>Academic background and qualifications</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/experience">Experience API</a>
                        <p>Professional work history</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/projects">Projects API</a>
                        <p>Portfolio projects and demos</p>
                    </div>
                    <div class="api-card">
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
                        <div class="item">
                            <h3>\${edu.degree}</h3>
                            <p><strong>\${edu.institution}</strong> - \${edu.location}</p>
                            <p>\${edu.startYear} - \${edu.endYear || 'Present'}</p>
                            \${edu.gpa ? \`<p><strong>GPA:</strong> \${edu.gpa}</p>\` : ''}
                            \${edu.description ? \`<p>\${edu.description}</p>\` : ''}
                        </div>
                    \`).join('');
                    document.getElementById('education-content').innerHTML = html;
                });

            // Load experience data
            fetch('/api/experience')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(exp => \`
                        <div class="item">
                            <h3>\${exp.title}</h3>
                            <p><strong>\${exp.company}</strong> - \${exp.location}</p>
                            <p>\${exp.startDate} - \${exp.endDate || 'Present'}</p>
                            <p>\${exp.description}</p>
                            <div style="margin-top: 15px;">
                                \${exp.technologies.map(tech => \`<span class="tech-tag">\${tech}</span>\`).join('')}
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('experience-content').innerHTML = html;
                });

            // Load projects
            fetch('/api/projects/featured')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(project => \`
                        <div class="item">
                            <h3>\${project.title}</h3>
                            <p>\${project.description}</p>
                            <div style="margin: 15px 0;">
                                \${project.technologies.map(tech => \`<span class="tech-tag">\${tech}</span>\`).join('')}
                            </div>
                            <div style="margin-top: 15px;">
                                \${project.githubUrl ? \`<a href="\${project.githubUrl}" target="_blank" style="margin-right: 15px;">GitHub</a>\` : ''}
                                \${project.liveUrl ? \`<a href="\${project.liveUrl}" target="_blank">Live Demo</a>\` : ''}
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('projects-content').innerHTML = html;
                });

            // Load blog posts
            fetch('/api/blog')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(post => \`
                        <div class="item">
                            <h3>\${post.title}</h3>
                            <p style="color: #6b7280; font-size: 14px;">Published: \${new Date(post.createdAt).toLocaleDateString()}</p>
                            <p>\${post.excerpt}</p>
                            \${post.tags ? \`<div style="margin-top: 10px;">\${post.tags.map(tag => \`<span class="tech-tag">\${tag}</span>\`).join('')}</div>\` : ''}
                        </div>
                    \`).join('');
                    document.getElementById('blog-content').innerHTML = html || '<p>No published blog posts yet.</p>';
                });

            // Load admin blog management
            fetch('/api/blog/admin')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(post => {
                        return '<div class="item" style="border-left-color: ' + (post.published ? '#10b981' : '#ef4444') + ';">' +
                            '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                                '<div style="flex: 1;">' +
                                    '<h4>' + post.title + '</h4>' +
                                    '<p style="font-size: 13px; color: #666;">' +
                                        'Status: <strong>' + (post.published ? 'Published' : 'Draft') + '</strong> | ' +
                                        'Words: ' + post.wordCount + ' | ' +
                                        'File: ' + (post.fileExists ? '✓ Saved' : '✗ Missing') +
                                        (post.originalFileName ? ' (' + post.originalFileName + ')' : '') +
                                    '</p>' +
                                    '<p style="font-size: 14px; margin: 8px 0;">' + post.excerpt + '</p>' +
                                    (post.tags ? '<div>' + post.tags.map(tag => '<span class="tech-tag" style="font-size: 11px;">' + tag + '</span>').join('') + '</div>' : '') +
                                '</div>' +
                                '<div style="margin-left: 15px;">' +
                                    '<button onclick="togglePublish(' + post.id + ', ' + post.published + ')" class="btn" style="margin: 2px; font-size: 12px; padding: 6px 12px;">' +
                                        (post.published ? 'Unpublish' : 'Publish') +
                                    '</button>' +
                                    '<button onclick="deletePost(' + post.id + ')" class="btn" style="margin: 2px; font-size: 12px; padding: 6px 12px; background: #ef4444;">' +
                                        'Delete' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                    document.getElementById('admin-blog-content').innerHTML = html || '<p>No blog posts yet.</p>';
                });

            // Handle DOCX upload with progress
            document.getElementById('upload-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const fileInput = document.getElementById('file-input');
                const statusDiv = document.getElementById('upload-status');
                
                if (!fileInput.files[0]) {
                    statusDiv.innerHTML = '<p style="color: #ef4444;">Please select a DOCX file</p>';
                    return;
                }
                
                const formData = new FormData();
                formData.append('docx', fileInput.files[0]);
                
                statusDiv.innerHTML = '<p style="color: #3b82f6;">Processing DOCX file...</p>';
                
                fetch('/api/blog/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        statusDiv.innerHTML = \`<p style="color: #ef4444;">Error: \${data.error}</p>\`;
                    } else {
                        statusDiv.innerHTML = \`
                            <p style="color: #10b981;">✓ Article created successfully!</p>
                            <p style="font-size: 14px;">Title: <strong>\${data.post.title}</strong></p>
                            <p style="font-size: 14px;">Content: \${data.extractedLength} characters extracted</p>
                            <p style="font-size: 14px;">Status: Draft (ready to publish)</p>
                        \`;
                        fileInput.value = '';
                        // Refresh the admin panel
                        setTimeout(() => location.reload(), 2000);
                    }
                })
                .catch(error => {
                    statusDiv.innerHTML = \`<p style="color: #ef4444;">Upload failed: \${error.message}</p>\`;
                });
            });

            // Blog management functions
            function togglePublish(postId, isPublished) {
                fetch(\`/api/blog/\${postId}/publish\`, { method: 'PATCH' })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        location.reload();
                    })
                    .catch(error => alert('Error: ' + error.message));
            }

            function deletePost(postId) {
                if (confirm('Are you sure you want to delete this post and its file?')) {
                    fetch(\`/api/blog/\${postId}\`, { method: 'DELETE' })
                        .then(res => res.json())
                        .then(data => {
                            alert(data.message);
                            location.reload();
                        })
                        .catch(error => alert('Error: ' + error.message));
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio website running on http://0.0.0.0:${PORT}`);
  console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
});