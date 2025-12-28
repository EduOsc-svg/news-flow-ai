export type Category = 'nasional' | 'tech' | 'lifestyle' | 'viral' | 'social';

export type Article = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  category: Category;
  is_published: boolean;
  is_breaking: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type ArticleInsert = Omit<Article, 'id' | 'created_at' | 'updated_at' | 'view_count'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  view_count?: number;
};

export type ArticleUpdate = Partial<ArticleInsert>;

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'nasional', label: 'Nasional' },
  { value: 'tech', label: 'Tech' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'viral', label: 'Viral' },
  { value: 'social', label: 'Social' },
];