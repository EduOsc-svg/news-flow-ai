import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroArticle } from '@/components/news/HeroArticle';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryTabs } from '@/components/news/CategoryTabs';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';
import { useArticles, useTrendingArticles } from '@/hooks/useArticles';
import type { Category } from '@/types/article';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as Category | undefined;

  // Fetch breaking news for hero
  const { articles: breakingArticles } = useArticles({ 
    isPublished: true, 
    isBreaking: true, 
    limit: 1 
  });

  // Fetch articles based on category filter
  const { articles, loading } = useArticles({ 
    isPublished: true, 
    category: category || undefined,
    limit: 12 
  });

  // Fetch trending articles for sidebar
  const { articles: trendingArticles, loading: trendingLoading } = useTrendingArticles(5);

  // Get hero article (breaking or first article)
  const heroArticle = breakingArticles[0] || articles[0];
  
  // Get remaining articles (exclude hero)
  const gridArticles = heroArticle 
    ? articles.filter(a => a.id !== heroArticle.id)
    : articles;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="container py-6">
        {loading && !heroArticle ? (
          <Skeleton className="w-full aspect-[21/9] rounded-lg" />
        ) : heroArticle ? (
          <HeroArticle article={heroArticle} />
        ) : (
          <div className="w-full aspect-[21/9] rounded-lg bg-secondary flex items-center justify-center">
            <div className="text-center">
              <h2 className="font-headline text-2xl font-bold text-muted-foreground mb-2">
                Belum Ada Berita
              </h2>
              <p className="font-body text-muted-foreground">
                Berita akan muncul di sini setelah dipublikasikan
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Category Tabs */}
      <section className="container py-4">
        <CategoryTabs />
      </section>

      {/* Main Content */}
      <section className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Grid */}
          <div className="lg:col-span-2">
            <h2 className="font-headline text-xl font-bold mb-6">
              {category 
                ? `Berita ${category.charAt(0).toUpperCase() + category.slice(1)}`
                : 'Berita Terbaru'
              }
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : gridArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gridArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="font-body text-muted-foreground">
                  Tidak ada berita dalam kategori ini.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingSidebar articles={trendingArticles} loading={trendingLoading} />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;