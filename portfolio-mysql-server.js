const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// MySQL Connection Configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123',
  port: 3306,
  database: 'portfolio'
};

let db;

// Initialize MySQL Connection and Create Database/Tables
async function initDatabase() {
  try {
    // First connect without database to create it
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    // Now connect to the specific database
    db = await mysql.createConnection(dbConfig);

    // Create tables
    await createTables();
    await insertSampleData();

    console.log('✓ MySQL database connected and initialized');
    console.log(`✓ Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.log('\n🔧 MySQL Setup Required:');
    console.log('1. Install MySQL Server');
    console.log('2. Create user: root with password: 123');
    console.log('3. Start MySQL service on port 3306');
    console.log('4. Grant privileges: GRANT ALL PRIVILEGES ON *.* TO "root"@"localhost";');
    console.log('\n📝 Or update dbConfig in the file with your MySQL credentials\n');
    
    // Fallback to in-memory mode
    console.log('⚠️  Falling back to in-memory storage mode...');
    return false;
  }
}

async function createTables() {
  // Education table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS education (
      id INT AUTO_INCREMENT PRIMARY KEY,
      degree VARCHAR(255) NOT NULL,
      institution VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      start_year VARCHAR(10),
      end_year VARCHAR(10),
      description TEXT,
      gpa VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Experience table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS experience (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      start_date VARCHAR(20),
      end_date VARCHAR(20),
      description TEXT,
      technologies JSON,
      is_current_job BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      technologies JSON,
      github_url VARCHAR(500),
      live_url VARCHAR(500),
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blog posts table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content LONGTEXT,
      excerpt TEXT,
      published BOOLEAN DEFAULT FALSE,
      tags JSON,
      file_path VARCHAR(500),
      original_filename VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      message TEXT NOT NULL,
      read_status BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function insertSampleData() {
  // Check if education data exists
  const [educationRows] = await db.execute('SELECT COUNT(*) as count FROM education');
  if (educationRows[0].count === 0) {
    await db.execute(`
      INSERT INTO education (degree, institution, location, start_year, end_year, description, gpa) VALUES
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?)
    `, [
      "Bachelor of Science in Computer Science", "University of Technology", "New York, NY", "2018", "2022",
      "Focused on software engineering, algorithms, and web development. Graduated Magna Cum Laude.", "3.8/4.0",
      "Master of Science in Software Engineering", "Tech Institute", "San Francisco, CA", "2022", "2024",
      "Advanced studies in distributed systems, cloud computing, and AI/ML applications.", "3.9/4.0"
    ]);
  }

  // Check if experience data exists
  const [experienceRows] = await db.execute('SELECT COUNT(*) as count FROM experience');
  if (experienceRows[0].count === 0) {
    await db.execute(`
      INSERT INTO experience (title, company, location, start_date, end_date, description, technologies, is_current_job) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      "Senior Full Stack Developer", "TechCorp Solutions", "San Francisco, CA", "2024-01", null,
      "Leading development of enterprise web applications using React, Node.js, and cloud technologies. Managing a team of 4 developers and architecting scalable solutions.",
      JSON.stringify(["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"]), true,
      "Full Stack Developer", "StartupX", "Remote", "2022-06", "2023-12",
      "Built and maintained multiple web applications from concept to deployment. Implemented CI/CD pipelines and improved application performance by 40%.",
      JSON.stringify(["React", "Express.js", "MongoDB", "Redis", "Kubernetes"]), false
    ]);
  }

  // Check if projects data exists
  const [projectRows] = await db.execute('SELECT COUNT(*) as count FROM projects');
  if (projectRows[0].count === 0) {
    await db.execute(`
      INSERT INTO projects (title, description, technologies, github_url, live_url, featured) VALUES
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)
    `, [
      "E-commerce Platform", "A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
      JSON.stringify(["React", "Node.js", "PostgreSQL", "Stripe API", "AWS"]),
      "https://github.com/johndoe/ecommerce-platform", "https://demo-ecommerce.example.com", true,
      "Task Management App", "A collaborative task management application with real-time updates and team collaboration features.",
      JSON.stringify(["Vue.js", "Express.js", "Socket.io", "MongoDB"]),
      "https://github.com/johndoe/task-manager", "https://taskmanager.example.com", true
    ]);
  }

  // Check if blog posts data exists
  const [blogRows] = await db.execute('SELECT COUNT(*) as count FROM blog_posts');
  if (blogRows[0].count === 0) {
    await db.execute(`
      INSERT INTO blog_posts (title, slug, content, excerpt, published, tags) VALUES
      (?, ?, ?, ?, ?, ?)
    `, [
      "Getting Started with React and TypeScript",
      "getting-started-with-react-typescript",
      "TypeScript has become an essential tool for React developers. In this comprehensive guide, we explore setup and best practices for building scalable applications.",
      "Learn how to set up and use TypeScript with React for better development experience.",
      true,
      JSON.stringify(["React", "TypeScript", "Frontend"])
    ]);
  }
}

// Create uploads directory
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/education', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM education ORDER BY start_year DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/education', async (req, res) => {
  try {
    const { degree, institution, location, start_year, end_year, description, gpa } = req.body;
    const [result] = await db.execute(`
      INSERT INTO education (degree, institution, location, start_year, end_year, description, gpa) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [degree, institution, location, start_year, end_year, description, gpa]);
    
    const [newEducation] = await db.execute('SELECT * FROM education WHERE id = ?', [result.insertId]);
    res.status(201).json(newEducation[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/experience', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM experience ORDER BY start_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experience', async (req, res) => {
  try {
    const { title, company, location, start_date, end_date, description, technologies, is_current_job } = req.body;
    const [result] = await db.execute(`
      INSERT INTO experience (title, company, location, start_date, end_date, description, technologies, is_current_job) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, company, location, start_date, end_date, description, JSON.stringify(technologies), is_current_job]);
    
    const [newExperience] = await db.execute('SELECT * FROM experience WHERE id = ?', [result.insertId]);
    res.status(201).json(newExperience[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/featured', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE featured = true ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, technologies, github_url, live_url, featured } = req.body;
    const [result] = await db.execute(`
      INSERT INTO projects (title, description, technologies, github_url, live_url, featured) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, JSON.stringify(technologies), github_url, live_url, featured]);
    
    const [newProject] = await db.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(newProject[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog/admin', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
    const postsWithFileInfo = rows.map(post => ({
      ...post,
      fileExists: post.file_path ? fs.existsSync(post.file_path) : false,
      wordCount: post.content ? post.content.split(/\s+/).length : 0
    }));
    res.json(postsWithFileInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM blog_posts WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
    
    // Save to database
    const [result_db] = await db.execute(`
      INSERT INTO blog_posts (title, slug, content, excerpt, published, tags, file_path, original_filename) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, extractedText, excerpt, false, JSON.stringify(['Article', 'Upload']), req.file.path, req.file.originalname]);
    
    const [newPost] = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [result_db.insertId]);
    
    console.log(`New blog post created: "${title}" from file: ${req.file.originalname}`);
    
    res.status(201).json({
      message: 'Article created successfully from DOCX file',
      post: newPost[0],
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

app.patch('/api/blog/:id/publish', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const [rows] = await db.execute('SELECT published FROM blog_posts WHERE id = ?', [postId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const newPublishedStatus = !rows[0].published;
    await db.execute('UPDATE blog_posts SET published = ? WHERE id = ?', [newPublishedStatus, postId]);
    
    const [updatedPost] = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    
    res.json({ 
      message: `Post ${newPublishedStatus ? 'published' : 'unpublished'} successfully`,
      post: updatedPost[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const [rows] = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    const post = rows[0];
    
    // Delete the uploaded file if it exists
    if (post.file_path && fs.existsSync(post.file_path)) {
      try {
        fs.unlinkSync(post.file_path);
        console.log(`Deleted file: ${post.file_path}`);
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
      }
    }
    
    // Delete from database
    await db.execute('DELETE FROM blog_posts WHERE id = ?', [postId]);
    
    res.json({ 
      message: 'Blog post and associated file deleted successfully',
      deletedPost: post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const [result] = await db.execute(`
      INSERT INTO contact_messages (name, email, subject, message) 
      VALUES (?, ?, ?, ?)
    `, [name, email, subject, message]);
    
    const [newMessage] = await db.execute('SELECT * FROM contact_messages WHERE id = ?', [result.insertId]);
    res.status(201).json(newMessage[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Main page with enhanced features
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
            .hero .db-status { 
                background: rgba(255,255,255,0.2); 
                padding: 10px; 
                border-radius: 8px; 
                margin-top: 20px; 
                font-size: 0.9em;
            }
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
            .btn.delete { background: #ef4444; }
            .btn.delete:hover { background: #dc2626; }
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
            .admin-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .admin-content { flex: 1; }
            .admin-actions { margin-left: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="hero">
                <h1>Portfolio Website</h1>
                <p>Full Stack Developer | React & Node.js Expert</p>
                <div class="db-status">
                    🗄️ MySQL Database Connected | Files Saved to /uploads/ | DOCX Processing Active
                </div>
            </div>
            
            <div class="section">
                <h2>🎓 Education</h2>
                <div id="education-content">Loading education data from MySQL...</div>
            </div>
            
            <div class="section">
                <h2>💼 Professional Experience</h2>
                <div id="experience-content">Loading experience data from MySQL...</div>
            </div>
            
            <div class="section">
                <h2>🚀 Featured Projects</h2>
                <div id="projects-content">Loading projects data from MySQL...</div>
            </div>
            
            <div class="section">
                <h2>📝 Blog</h2>
                <div id="blog-content">Loading published blog posts...</div>
                
                <h3 style="margin-top: 30px;">Upload New Article</h3>
                <div class="upload-area">
                    <p><strong>Upload DOCX files to automatically create blog posts</strong></p>
                    <p style="font-size: 14px; color: #666; margin: 10px 0;">
                        • Files saved to MySQL database and /uploads/ directory<br>
                        • Text extracted using Mammoth library<br>
                        • Posts created as drafts (unpublished by default)<br>
                        • Title from filename or first line of content
                    </p>
                    <form action="/api/blog/upload" method="post" enctype="multipart/form-data" id="upload-form">
                        <input type="file" name="docx" accept=".docx" required class="btn" id="file-input">
                        <button type="submit" class="btn">Upload & Process DOCX</button>
                    </form>
                    <div id="upload-status" style="margin-top: 15px;"></div>
                </div>
                
                <h3 style="margin-top: 30px;">Blog Management (All Posts)</h3>
                <div id="admin-blog-content">
                    <p>Loading blog management panel from MySQL...</p>
                </div>
            </div>
            
            <div class="section">
                <h2>🔗 API Endpoints (MySQL Backend)</h2>
                <div class="api-grid">
                    <div class="api-card">
                        <a href="/api/education">Education API</a>
                        <p>Academic background stored in MySQL</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/experience">Experience API</a>
                        <p>Professional work history with JSON fields</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/projects">Projects API</a>
                        <p>Portfolio projects with metadata</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/blog">Blog API</a>
                        <p>Published articles from MySQL</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/blog/admin">Admin Blog API</a>
                        <p>All posts (drafts + published)</p>
                    </div>
                    <div class="api-card">
                        <a href="/api/contact">Contact API</a>
                        <p>Messages stored in database</p>
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
                            <p>\${edu.start_year} - \${edu.end_year || 'Present'}</p>
                            \${edu.gpa ? \`<p><strong>GPA:</strong> \${edu.gpa}</p>\` : ''}
                            \${edu.description ? \`<p>\${edu.description}</p>\` : ''}
                        </div>
                    \`).join('');
                    document.getElementById('education-content').innerHTML = html;
                })
                .catch(err => {
                    document.getElementById('education-content').innerHTML = '<p style="color: #ef4444;">Error loading education data: ' + err.message + '</p>';
                });

            // Load experience data
            fetch('/api/experience')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(exp => \`
                        <div class="item">
                            <h3>\${exp.title}</h3>
                            <p><strong>\${exp.company}</strong> - \${exp.location}</p>
                            <p>\${exp.start_date} - \${exp.end_date || 'Present'}</p>
                            <p>\${exp.description}</p>
                            <div style="margin-top: 15px;">
                                \${exp.technologies.map(tech => \`<span class="tech-tag">\${tech}</span>\`).join('')}
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('experience-content').innerHTML = html;
                })
                .catch(err => {
                    document.getElementById('experience-content').innerHTML = '<p style="color: #ef4444;">Error loading experience data: ' + err.message + '</p>';
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
                                \${project.github_url ? \`<a href="\${project.github_url}" target="_blank" style="margin-right: 15px;">GitHub</a>\` : ''}
                                \${project.live_url ? \`<a href="\${project.live_url}" target="_blank">Live Demo</a>\` : ''}
                            </div>
                        </div>
                    \`).join('');
                    document.getElementById('projects-content').innerHTML = html;
                })
                .catch(err => {
                    document.getElementById('projects-content').innerHTML = '<p style="color: #ef4444;">Error loading projects data: ' + err.message + '</p>';
                });

            // Load published blog posts
            fetch('/api/blog')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(post => \`
                        <div class="item">
                            <h3>\${post.title}</h3>
                            <p style="color: #6b7280; font-size: 14px;">Published: \${new Date(post.created_at).toLocaleDateString()}</p>
                            <p>\${post.excerpt}</p>
                            \${post.tags ? \`<div style="margin-top: 10px;">\${post.tags.map(tag => \`<span class="tech-tag">\${tag}</span>\`).join('')}</div>\` : ''}
                        </div>
                    \`).join('');
                    document.getElementById('blog-content').innerHTML = html || '<p>No published blog posts yet.</p>';
                })
                .catch(err => {
                    document.getElementById('blog-content').innerHTML = '<p style="color: #ef4444;">Error loading blog posts: ' + err.message + '</p>';
                });

            // Load admin blog management
            fetch('/api/blog/admin')
                .then(res => res.json())
                .then(data => {
                    const html = data.map(post => {
                        const statusColor = post.published ? '#10b981' : '#ef4444';
                        const fileStatus = post.fileExists ? '✓ Saved' : '✗ Missing';
                        return \`
                            <div class="item admin-item" style="border-left-color: \${statusColor};">
                                <div class="admin-content">
                                    <h4>\${post.title}</h4>
                                    <p style="font-size: 13px; color: #666;">
                                        Status: <strong>\${post.published ? 'Published' : 'Draft'}</strong> | 
                                        Words: \${post.wordCount} | 
                                        File: \${fileStatus}
                                        \${post.original_filename ? \` (\${post.original_filename})\` : ''}
                                    </p>
                                    <p style="font-size: 14px; margin: 8px 0;">\${post.excerpt}</p>
                                    \${post.tags ? \`<div>\${post.tags.map(tag => \`<span class="tech-tag" style="font-size: 11px;">\${tag}</span>\`).join('')}</div>\` : ''}
                                </div>
                                <div class="admin-actions">
                                    <button onclick="togglePublish(\${post.id}, \${post.published})" class="btn" style="font-size: 12px; padding: 6px 12px;">
                                        \${post.published ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button onclick="deletePost(\${post.id})" class="btn delete" style="font-size: 12px; padding: 6px 12px;">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        \`;
                    }).join('');
                    document.getElementById('admin-blog-content').innerHTML = html || '<p>No blog posts yet.</p>';
                })
                .catch(err => {
                    document.getElementById('admin-blog-content').innerHTML = '<p style="color: #ef4444;">Error loading admin blog data: ' + err.message + '</p>';
                });

            // Handle DOCX upload
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
                
                statusDiv.innerHTML = '<p style="color: #3b82f6;">Processing DOCX file and saving to MySQL...</p>';
                
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
                            <p style="color: #10b981;">✓ Article saved to MySQL database!</p>
                            <p style="font-size: 14px;">Title: <strong>\${data.post.title}</strong></p>
                            <p style="font-size: 14px;">Content: \${data.extractedLength} characters extracted</p>
                            <p style="font-size: 14px;">Status: Draft (ready to publish)</p>
                            <p style="font-size: 14px;">Database ID: \${data.post.id}</p>
                        \`;
                        fileInput.value = '';
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
                if (confirm('Are you sure you want to delete this post and its file from MySQL?')) {
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

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio website running on http://0.0.0.0:${PORT}`);
    console.log(`✓ MySQL database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    console.log(`✓ File uploads: ${uploadsDir}`);
    console.log(`✓ API endpoints available at http://0.0.0.0:${PORT}/api`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});