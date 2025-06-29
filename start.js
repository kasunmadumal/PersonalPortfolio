const express = require('express');
const cors = require('cors');
const path = require('path');
const { createRoutes } = require('./server/routes');
const { MemStorage } = require('./server/storage');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize storage
const storage = new MemStorage();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(createRoutes(storage));

// For development, serve a simple HTML page
app.get('*', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Portfolio Website</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .nav { margin-bottom: 30px; }
            .nav a { margin-right: 20px; text-decoration: none; color: #0066cc; }
            .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            h1 { color: #333; }
            h2 { color: #666; }
        </style>
    </head>
    <body>
        <div class="nav">
            <a href="/api/education">Education API</a>
            <a href="/api/experience">Experience API</a>
            <a href="/api/projects">Projects API</a>
            <a href="/api/blog">Blog API</a>
            <a href="/api/contact">Contact API</a>
        </div>
        
        <div class="section">
            <h1>Portfolio Website Backend</h1>
            <p>Your portfolio website backend is running successfully!</p>
            
            <h2>Features:</h2>
            <ul>
                <li>✅ Education API with dummy data</li>
                <li>✅ Professional Experience API</li>
                <li>✅ Projects showcase with featured projects</li>
                <li>✅ Blog system with DOCX upload capability</li>
                <li>✅ Contact form submission handling</li>
            </ul>
            
            <h2>API Endpoints:</h2>
            <ul>
                <li><strong>GET /api/education</strong> - Fetch education data</li>
                <li><strong>GET /api/experience</strong> - Fetch work experience</li>
                <li><strong>GET /api/projects</strong> - Fetch all projects</li>
                <li><strong>GET /api/projects/featured</strong> - Fetch featured projects</li>
                <li><strong>GET /api/blog</strong> - Fetch published blog posts</li>
                <li><strong>POST /api/blog/upload</strong> - Upload DOCX file to create blog post</li>
                <li><strong>POST /api/contact</strong> - Submit contact form</li>
            </ul>
            
            <h2>Blog Upload:</h2>
            <p>Upload a DOCX file to automatically create a blog post. The system will extract the text content and use the first line as the title.</p>
            
            <form action="/api/blog/upload" method="post" enctype="multipart/form-data" style="margin-top: 20px;">
                <input type="file" name="docx" accept=".docx" required style="margin-right: 10px;">
                <button type="submit" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px;">Upload Article</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio website backend running on http://0.0.0.0:${PORT}`);
  console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
});