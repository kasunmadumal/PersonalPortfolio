import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import { IStorage } from './storage';
import { 
  insertEducationSchema,
  insertExperienceSchema,
  insertProjectSchema,
  insertBlogPostSchema,
  insertContactMessageSchema
} from '../shared/schema';

const router = express.Router();

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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export function createRoutes(storage: IStorage) {
  // Education routes
  router.get('/api/education', async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch education data' });
    }
  });

  router.post('/api/education', async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const education = await storage.addEducation(validatedData);
      res.status(201).json(education);
    } catch (error) {
      res.status(400).json({ error: 'Invalid education data' });
    }
  });

  // Experience routes
  router.get('/api/experience', async (req, res) => {
    try {
      const experience = await storage.getExperience();
      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch experience data' });
    }
  });

  router.post('/api/experience', async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.addExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ error: 'Invalid experience data' });
    }
  });

  // Projects routes
  router.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects data' });
    }
  });

  router.get('/api/projects/featured', async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured projects' });
    }
  });

  router.post('/api/projects', async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.addProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: 'Invalid project data' });
    }
  });

  // Blog routes
  router.get('/api/blog', async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  router.get('/api/blog/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ error: 'Blog post not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  router.post('/api/blog', async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.addBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: 'Invalid blog post data' });
    }
  });

  // DOCX upload route for blog posts
  router.post('/api/blog/upload', upload.single('docx'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Extract text from DOCX
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      const content = result.value;

      if (!content.trim()) {
        res.status(400).json({ error: 'Document appears to be empty' });
        return;
      }

      // Extract title from first line or use filename
      const lines = content.split('\n').filter(line => line.trim());
      const title = lines[0]?.trim() || req.file.originalname.replace('.docx', '');
      
      // Create slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Create excerpt from first paragraph
      const excerpt = lines.slice(1, 3).join(' ').substring(0, 200) + '...';

      const blogPostData = {
        title,
        slug,
        content,
        excerpt,
        published: false,
        tags: []
      };

      const validatedData = insertBlogPostSchema.parse(blogPostData);
      const post = await storage.addBlogPost(validatedData);
      
      res.status(201).json(post);
    } catch (error) {
      console.error('Error processing DOCX upload:', error);
      res.status(500).json({ error: 'Failed to process document' });
    }
  });

  // Contact routes
  router.get('/api/contact', async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contact messages' });
    }
  });

  router.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.addContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: 'Invalid contact message data' });
    }
  });

  return router;
}