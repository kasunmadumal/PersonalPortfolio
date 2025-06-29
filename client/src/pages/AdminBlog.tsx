import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export default function AdminBlogPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedPost, setUploadedPost] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('docx', file);
      return fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      }).then(res => {
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
      });
    },
    onSuccess: (data) => {
      setUploadStatus('success');
      setUploadedPost(data);
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadedPost(null);
      }, 5000);
    },
    onError: () => {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
      return;
    }
    
    setUploadStatus('uploading');
    uploadMutation.mutate(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog">
          <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={20} />
            <span>Back to Blog</span>
          </button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 flex items-center">
          <Upload className="mr-3" size={36} />
          Upload Blog Article
        </h1>

        <div className="space-y-8">
          {/* Upload Area */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Upload DOCX File</h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : uploadStatus === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : uploadStatus === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadStatus === 'uploading' ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-lg">Processing your document...</p>
                  <p className="text-muted-foreground">This may take a moment</p>
                </div>
              ) : uploadStatus === 'success' ? (
                <div className="space-y-4">
                  <CheckCircle size={48} className="text-green-500 mx-auto" />
                  <p className="text-lg text-green-600 dark:text-green-400 font-semibold">
                    Article uploaded successfully!
                  </p>
                  {uploadedPost && (
                    <div className="text-muted-foreground">
                      <p>Title: {uploadedPost.title}</p>
                      <p>Status: {uploadedPost.published ? 'Published' : 'Draft'}</p>
                    </div>
                  )}
                </div>
              ) : uploadStatus === 'error' ? (
                <div className="space-y-4">
                  <FileText size={48} className="text-red-500 mx-auto" />
                  <p className="text-lg text-red-600 dark:text-red-400">
                    Upload failed. Please try again.
                  </p>
                  <p className="text-muted-foreground">
                    Make sure you're uploading a valid .docx file
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileText size={48} className="text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg mb-2">
                      Drag and drop your DOCX file here, or{' '}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary hover:underline"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-muted-foreground">
                      Only .docx files are supported (max 10MB)
                    </p>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">How it works:</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                Upload your .docx file containing your blog article
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                The system will extract the text content and create a blog post
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                The article title will be taken from the first line of your document
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                Posts are saved as drafts initially - you can publish them later
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}