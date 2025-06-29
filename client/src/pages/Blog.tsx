import { useQuery } from '@tanstack/react-query';
import { BookOpen, Calendar, Tag } from 'lucide-react';
import { Link } from 'wouter';
import { BlogPost } from '@shared/schema';

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6 mb-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-16 bg-muted rounded mb-4"></div>
              <div className="flex space-x-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-6 w-16 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center">
            <BookOpen className="mr-3" size={36} />
            Blog
          </h1>
          <Link href="/admin/blog">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
              Upload Article
            </button>
          </Link>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No blog posts yet</h2>
            <p className="text-muted-foreground">Check back later for new articles!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold mb-3 hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                {post.excerpt && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag size={16} className="text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link href={`/blog/${post.slug}`}>
                  <span className="text-primary hover:underline cursor-pointer">
                    Read more →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}