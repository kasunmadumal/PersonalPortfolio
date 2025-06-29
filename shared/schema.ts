import { z } from 'zod';

// Education schema
export const educationSchema = z.object({
  id: z.number(),
  degree: z.string(),
  institution: z.string(),
  location: z.string(),
  startYear: z.string(),
  endYear: z.string().optional(),
  description: z.string().optional(),
  gpa: z.string().optional(),
});

// Experience schema
export const experienceSchema = z.object({
  id: z.number(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string(),
  technologies: z.array(z.string()),
  isCurrentJob: z.boolean().default(false),
});

// Project schema
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

// Blog post schema
export const blogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()),
});

// Contact message schema
export const contactMessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  createdAt: z.date(),
  read: z.boolean().default(false),
});

// Insert schemas (omit auto-generated fields)
export const insertEducationSchema = educationSchema.omit({ id: true });
export const insertExperienceSchema = experienceSchema.omit({ id: true });
export const insertProjectSchema = projectSchema.omit({ id: true });
export const insertBlogPostSchema = blogPostSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertContactMessageSchema = contactMessageSchema.omit({ 
  id: true, 
  createdAt: true, 
  read: true 
});

// Insert types
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Select types
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;