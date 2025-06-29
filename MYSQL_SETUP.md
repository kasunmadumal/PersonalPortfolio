# MySQL Database Setup for Portfolio Website

## Overview
This guide explains how to set up MySQL database for the portfolio website with DOCX file upload and blog management functionality.

## Prerequisites
- MySQL Server 8.0+ installed
- Node.js and npm installed
- Portfolio project files

## Database Configuration

### Connection Settings (portfolio-mysql-server.js)
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root', 
  password: '123',
  port: 3306,
  database: 'portfolio'
};
```

## Database Schema

The system creates 5 tables automatically:

### 1. education
```sql
CREATE TABLE education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  degree VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_year VARCHAR(10),
  end_year VARCHAR(10),
  description TEXT,
  gpa VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. experience  
```sql
CREATE TABLE experience (
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
);
```

### 3. projects
```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  technologies JSON,
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. blog_posts (DOCX Upload Target)
```sql
CREATE TABLE blog_posts (
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
);
```

### 5. contact_messages
```sql
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## DOCX File Storage Process

### File Upload Flow:
1. **File Upload**: DOCX file uploaded via `/api/blog/upload`
2. **File Storage**: Saved to `/uploads/` directory with timestamp prefix
3. **Text Extraction**: Mammoth.js extracts plain text from DOCX
4. **Database Insert**: Article saved to `blog_posts` table
5. **Metadata Storage**: File path and original filename stored

### File Storage Structure:
```
/uploads/
├── 1703876543210-my-article.docx
├── 1703876789456-another-post.docx
└── ...
```

### Database Record Example:
```json
{
  "id": 1,
  "title": "My Article Title",
  "slug": "my-article-title",
  "content": "Full extracted text content...",
  "excerpt": "First 200 characters...",
  "published": false,
  "tags": ["Article", "Upload"],
  "file_path": "/uploads/1703876543210-my-article.docx",
  "original_filename": "my-article.docx",
  "created_at": "2024-12-29T10:15:43.000Z"
}
```

## API Endpoints for Data Management

### Blog Management:
- `GET /api/blog` - Published articles only
- `GET /api/blog/admin` - All articles (drafts + published)
- `POST /api/blog/upload` - Upload DOCX file
- `PATCH /api/blog/:id/publish` - Toggle publish status
- `DELETE /api/blog/:id` - Delete article and file

### Other Data:
- `GET /api/education` - Education records
- `GET /api/experience` - Work experience
- `GET /api/projects` - Portfolio projects
- `GET /api/contact` - Contact messages

## Manual MySQL Setup Commands

If you need to set up MySQL manually:

```sql
-- Create database
CREATE DATABASE portfolio;

-- Create user (if needed)
CREATE USER 'root'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON portfolio.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Use database
USE portfolio;

-- Tables will be created automatically by the application
```

## Running the MySQL Version

1. Ensure MySQL is running on localhost:3306
2. Update credentials in `portfolio-mysql-server.js` if needed
3. Run: `node portfolio-mysql-server.js`
4. Visit: http://localhost:3000

## Features

- **Persistent Storage**: All data saved to MySQL database
- **File Management**: DOCX files stored in filesystem + database metadata
- **Blog Administration**: Publish/unpublish/delete articles via web interface
- **Automatic Schema**: Database and tables created automatically on first run
- **Error Handling**: Graceful fallbacks and clear error messages
- **Sample Data**: Default portfolio content loaded automatically

## File Upload Workflow

1. User selects DOCX file via web interface
2. File uploaded to `/uploads/` with unique timestamp filename
3. Mammoth library extracts text content from DOCX
4. Article title extracted from filename or first line
5. URL slug generated from title
6. Content excerpt created (first 200 characters)
7. Record inserted into `blog_posts` table with file metadata
8. User can publish/edit via admin interface