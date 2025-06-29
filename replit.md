# Replit.md

## Overview

A personal portfolio website with integrated blog system that converts DOCX files to blog posts, built with React and Express.js. The application features a comprehensive portfolio showcasing educational qualifications, professional experiences, projects, and a personalized blog with DOCX upload functionality.

## System Architecture

**Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching, Tailwind CSS for styling
**Backend**: Express.js with TypeScript, in-memory storage for data persistence
**File Processing**: Mammoth.js for DOCX to text conversion
**Styling**: Dark/light mode support with Tailwind CSS variables

## Key Components

**Frontend Pages**:
- Home: Hero section with featured projects and skills showcase
- Education: Educational background with institutions and achievements
- Experience: Professional work history with technologies used
- Projects: Portfolio projects with featured/regular categorization
- Blog: Article listing with DOCX upload capability
- Contact: Contact form with personal information
- Admin Blog: DOCX file upload interface for creating blog posts

**Backend Services**:
- API routes for CRUD operations on all data models
- File upload handling for DOCX documents
- Text extraction and blog post creation from DOCX files
- In-memory storage with dummy data for demonstration

## Data Flow

**Blog Creation**: User uploads DOCX → Mammoth extracts text → Creates blog post with title from first line → Saves as draft
**Data Fetching**: Frontend uses TanStack Query → API endpoints → In-memory storage → Returns JSON data
**Contact Form**: Form submission → Validation with Zod → Storage in contact messages

## External Dependencies

**Core Framework**: React 18, Express.js 4
**State Management**: TanStack Query for server state
**Styling**: Tailwind CSS with custom theme variables
**File Processing**: Mammoth for DOCX conversion, Multer for file uploads
**Type Safety**: TypeScript, Zod for runtime validation
**Icons**: Lucide React for consistent iconography

## Deployment Strategy

**Development**: Concurrent server (Express) and client (Vite) development servers
**Production**: Express server serves built React application as static files
**API**: RESTful endpoints under /api prefix with JSON responses

## Recent Changes

- June 29, 2025: Complete full-stack portfolio website implementation
- Created comprehensive data models for education, experience, projects, blog posts, and contact messages
- Implemented all frontend pages with responsive design and dark mode support
- Built Express API with DOCX upload and text extraction capabilities
- Added proper TypeScript configuration and Tailwind CSS setup
- Integrated dummy data for immediate demonstration and testing

## User Preferences

Preferred communication style: Simple, everyday language.
Portfolio content: Currently using dummy data for demonstration - user will provide real data later.