import { Link } from 'react-router-dom';
import type { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={`/article/${article.id}`} className="group flex gap-3 py-3 border-b border-border last:border-0 hover-lift">
        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-20 h-16 object-cover rounded flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-headline text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h4>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {formatDate(article.created_at)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Card className="group overflow-hidden news-card-shadow hover-lift transition-all duration-200">
      <Link to={`/article/${article.id}`} className="block">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          {article.thumbnail_url ? (
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <span className="text-4xl font-headline font-bold text-muted-foreground/30">
                {article.category.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
          >
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-headline text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground font-sans">
            <span>{formatDate(article.created_at)}</span>
            {article.source_url && (
              <span className="flex items-center gap-1 text-primary">
                <Bot className="h-3 w-3" />
                AI
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}