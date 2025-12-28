import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Article, Category } from '@/types/article';

export function useArticles(options?: {
  category?: Category;
  isPublished?: boolean;
  limit?: number;
  isBreaking?: boolean;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [options?.category, options?.isPublished, options?.limit, options?.isBreaking]);

  async function fetchArticles() {
    try {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      if (options?.isPublished !== undefined) {
        query = query.eq('is_published', options.isPublished);
      }

      if (options?.isBreaking !== undefined) {
        query = query.eq('is_breaking', options.isBreaking);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles((data as Article[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch articles'));
    } finally {
      setLoading(false);
    }
  }

  return { articles, loading, error, refetch: fetchArticles };
}

export function useArticle(id: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  async function fetchArticle(articleId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .maybeSingle();

      if (error) throw error;
      setArticle(data as Article | null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch article'));
    } finally {
      setLoading(false);
    }
  }

  return { article, loading, error, refetch: () => id && fetchArticle(id) };
}

export function useTrendingArticles(limit: number = 5) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('is_published', true)
          .order('view_count', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setArticles((data as Article[]) || []);
      } catch (err) {
        console.error('Failed to fetch trending articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, [limit]);

  return { articles, loading };
}