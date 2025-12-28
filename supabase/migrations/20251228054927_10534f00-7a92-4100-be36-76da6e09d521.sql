-- Create articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  source_url TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'viral' CHECK (category IN ('nasional', 'tech', 'lifestyle', 'viral', 'social')),
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Anyone can view published articles" 
ON public.articles 
FOR SELECT 
USING (is_published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can insert articles" 
ON public.articles 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles" 
ON public.articles 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete articles" 
ON public.articles 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all articles" 
ON public.articles 
FOR SELECT 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_is_published ON public.articles(is_published);
CREATE INDEX idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX idx_articles_view_count ON public.articles(view_count DESC);