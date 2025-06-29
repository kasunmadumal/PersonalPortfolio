"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertContactMessageSchema = exports.insertBlogPostSchema = exports.insertProjectSchema = exports.insertExperienceSchema = exports.insertEducationSchema = exports.contactMessageSchema = exports.blogPostSchema = exports.projectSchema = exports.experienceSchema = exports.educationSchema = void 0;
const zod_1 = require("zod");
// Education schema
exports.educationSchema = zod_1.z.object({
    id: zod_1.z.number(),
    degree: zod_1.z.string(),
    institution: zod_1.z.string(),
    location: zod_1.z.string(),
    startYear: zod_1.z.string(),
    endYear: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    gpa: zod_1.z.string().optional(),
});
// Experience schema
exports.experienceSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    company: zod_1.z.string(),
    location: zod_1.z.string(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string().optional(),
    description: zod_1.z.string(),
    technologies: zod_1.z.array(zod_1.z.string()),
    isCurrentJob: zod_1.z.boolean().default(false),
});
// Project schema
exports.projectSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    technologies: zod_1.z.array(zod_1.z.string()),
    githubUrl: zod_1.z.string().optional(),
    liveUrl: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    featured: zod_1.z.boolean().default(false),
});
// Blog post schema
exports.blogPostSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    slug: zod_1.z.string(),
    content: zod_1.z.string(),
    excerpt: zod_1.z.string().optional(),
    published: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    tags: zod_1.z.array(zod_1.z.string()),
});
// Contact message schema
exports.contactMessageSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    subject: zod_1.z.string(),
    message: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    read: zod_1.z.boolean().default(false),
});
// Insert schemas (omit auto-generated fields)
exports.insertEducationSchema = exports.educationSchema.omit({ id: true });
exports.insertExperienceSchema = exports.experienceSchema.omit({ id: true });
exports.insertProjectSchema = exports.projectSchema.omit({ id: true });
exports.insertBlogPostSchema = exports.blogPostSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.insertContactMessageSchema = exports.contactMessageSchema.omit({
    id: true,
    createdAt: true,
    read: true
});
