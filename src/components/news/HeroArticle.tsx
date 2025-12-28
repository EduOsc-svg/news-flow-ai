import { Link } from 'react-router-dom';
import type { Article } from '@/types/article';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <Link 
      to={`/article/${article.id}`}
      className="group relative block overflow-hidden rounded-lg aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] news-card-shadow hover-lift"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          {article.is_breaking && (
            <Badge variant="destructive" className="gap-1 animate-pulse">
              <Flame className="h-3 w-3" />
              Breaking
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
        </div>

        <h1 className="font-headline text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 line-clamp-3">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="font-body text-white/80 text-base md:text-lg line-clamp-2 max-w-3xl mb-4">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-white/60 text-sm font-sans">
          <span>{formatDate(article.created_at)}</span>
          <span>•</span>
          <span>{article.view_count} kali dibaca</span>
        </div>
      </div>
    </Link>
  );
}