import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useArticle } from '@/hooks/useArticles';
import { supabase } from '@/integrations/supabase/client';
import type { Category, ArticleInsert } from '@/types/article';
import { CATEGORIES } from '@/types/article';
import { extractExcerpt, isSocialUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Newspaper, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  Save,
  Eye,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

const ArticleForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { article: existingArticle, loading: articleLoading } = useArticle(isEditing ? id : undefined);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState<Category>('viral');
  const [isPublished, setIsPublished] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Load existing article data
  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setContent(existingArticle.content);
      setSourceUrl(existingArticle.source_url || '');
      setThumbnailUrl(existingArticle.thumbnail_url || '');
      setCategory(existingArticle.category);
      setIsPublished(existingArticle.is_published);
      setIsBreaking(existingArticle.is_breaking);
    }
  }, [existingArticle]);

  if (authLoading || (isEditing && articleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  const handleGenerateAI = async () => {
    if (!sourceUrl) {
      toast({
        variant: "destructive",
        title: "URL Sumber Diperlukan",
        description: "Masukkan link TikTok atau Instagram terlebih dahulu.",
      });
      return;
    }

    const { isTikTok, isInstagram } = isSocialUrl(sourceUrl);
    if (!isTikTok && !isInstagram) {
      toast({
        variant: "destructive",
        title: "URL Tidak Valid",
        description: "Hanya URL TikTok atau Instagram yang didukung.",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-article', {
        body: { sourceUrl },
      });

      if (error) throw error;

      if (data.title) setTitle(data.title);
      if (data.content) setContent(data.content);
      if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
      if (data.category) setCategory(data.category);

      toast({
        title: "Artikel Berhasil Di-generate!",
        description: "Silakan review dan edit sesuai kebutuhan.",
      });
    } catch (err) {
      console.error('AI generation error:', err);
      toast({
        variant: "destructive",
        title: "Gagal Generate Artikel",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat generate artikel.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Form Tidak Lengkap",
        description: "Judul dan konten artikel wajib diisi.",
      });
      return;
    }

    setSaving(true);
    try {
      const articleData: ArticleInsert = {
        title: title.trim(),
        content: content.trim(),
        excerpt: extractExcerpt(content),
        source_url: sourceUrl.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        category,
        is_published: isPublished,
        is_breaking: isBreaking,
      };

      if (isEditing && id) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Artikel Diperbarui",
          description: "Perubahan berhasil disimpan.",
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert(articleData);

        if (error) throw error;

        toast({
          title: "Artikel Dibuat",
          description: isPublished 
            ? "Artikel berhasil dipublikasikan."
            : "Artikel disimpan sebagai draft.",
        });
      }

      navigate('/admin');
    } catch (err) {
      console.error('Save error:', err);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
              <Newspaper className="h-6 w-6" />
              <span>OmniNews</span>
            </Link>
            <Badge variant="secondary" className="font-sans text-xs">
              {isEditing ? 'Edit Artikel' : 'Artikel Baru'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* AI Generation Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/30 rounded-lg p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="sourceUrl" className="font-sans font-medium flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  URL Sumber (TikTok / Instagram)
                </Label>
                <Input
                  id="sourceUrl"
                  placeholder="https://www.tiktok.com/@username/video/..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button
                type="button"
                onClick={handleGenerateAI}
                disabled={generating || !sourceUrl}
                className="font-sans whitespace-nowrap"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Auto-Generate with AI
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2 font-body">
              Masukkan link video TikTok atau Instagram, lalu klik tombol untuk generate artikel otomatis dengan AI.
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-background rounded-lg p-6 border border-border space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-sans font-medium">
                Judul Artikel *
              </Label>
              <Input
                id="title"
                placeholder="Masukkan judul artikel yang menarik..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-headline"
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl" className="font-sans font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                URL Thumbnail
              </Label>
              <Input
                id="thumbnailUrl"
                placeholder="https://example.com/image.jpg"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              {thumbnailUrl && (
                <img 
                  src={thumbnailUrl} 
                  alt="Preview" 
                  className="mt-2 max-h-40 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="font-sans font-medium">
                Kategori *
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="font-sans font-medium">
                Konten Artikel *
              </Label>
              <Textarea
                id="content"
                placeholder="Tulis konten artikel di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="font-body resize-y min-h-[300px]"
              />
              <p className="text-sm text-muted-foreground font-sans">
                {content.length} karakter
              </p>
            </div>

            {/* Toggles */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="isPublished" className="font-sans cursor-pointer">
                  <Eye className="h-4 w-4 inline mr-2" />
                  Publikasikan
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="isBreaking"
                  checked={isBreaking}
                  onCheckedChange={setIsBreaking}
                />
                <Label htmlFor="isBreaking" className="font-sans cursor-pointer">
                  🔥 Breaking News
                </Label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link to="/admin">
              <Button type="button" variant="outline" className="font-sans">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="font-sans">
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Simpan Perubahan' : 'Simpan Artikel'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ArticleForm;