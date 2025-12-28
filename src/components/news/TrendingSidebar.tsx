import type { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';
import { TrendingUp } from 'lucide-react';

interface TrendingSidebarProps {
  articles: Article[];
  loading?: boolean;
}

export function TrendingSidebar({ articles, loading }: TrendingSidebarProps) {
  if (loading) {
    return (
      <aside className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-headline text-lg font-bold">Trending Now</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-20 h-16 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <aside className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-headline text-lg font-bold">Trending Now</h2>
      </div>
      <div>
        {articles.map((article, index) => (
          <div key={article.id} className="flex items-start gap-3">
            <span className="font-headline text-2xl font-bold text-muted-foreground/50 leading-none pt-3">
              {index + 1}
            </span>
            <div className="flex-1">
              <ArticleCard article={article} variant="compact" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}