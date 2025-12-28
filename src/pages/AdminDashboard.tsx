import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useArticles } from '@/hooks/useArticles';
import { supabase } from '@/integrations/supabase/client';
import type { Article } from '@/types/article';
import { CATEGORIES } from '@/types/article';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { 
  Newspaper, 
  Plus, 
  Pencil, 
  Trash2, 
  LogOut, 
  Loader2,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading, signOut, user } = useAuth();
  const { articles, loading, refetch } = useArticles();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteArticle, setDeleteArticle] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteArticle) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', deleteArticle.id);

      if (error) throw error;

      toast({
        title: "Artikel Dihapus",
        description: "Artikel berhasil dihapus.",
      });
      refetch();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal Menghapus",
        description: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    } finally {
      setDeleting(false);
      setDeleteArticle(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const togglePublish = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ is_published: !article.is_published })
        .eq('id', article.id);

      if (error) throw error;

      toast({
        title: article.is_published ? "Artikel Disembunyikan" : "Artikel Dipublikasikan",
        description: article.is_published 
          ? "Artikel tidak lagi tampil di publik."
          : "Artikel sekarang tampil di publik.",
      });
      refetch();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Gagal Mengubah Status",
        description: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
            <Newspaper className="h-6 w-6" />
            <span>OmniNews</span>
            <Badge variant="secondary" className="ml-2 font-sans text-xs">Admin</Badge>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-sans hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-headline text-2xl font-bold">Daftar Berita</h1>
            <p className="font-body text-muted-foreground">
              Kelola semua artikel berita Anda
            </p>
          </div>

          <Link to="/admin/articles/new">
            <Button className="font-sans">
              <Plus className="h-4 w-4 mr-2" />
              Buat Berita Baru
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        {/* Articles Table */}
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground mb-4">
                {searchTerm ? 'Tidak ada artikel yang cocok.' : 'Belum ada artikel.'}
              </p>
              {!searchTerm && (
                <Link to="/admin/articles/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Artikel Pertama
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans">Judul</TableHead>
                  <TableHead className="font-sans">Kategori</TableHead>
                  <TableHead className="font-sans">Status</TableHead>
                  <TableHead className="font-sans">Tanggal</TableHead>
                  <TableHead className="font-sans text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-body max-w-xs">
                      <div className="line-clamp-2">{article.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-sans capitalize">
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={article.is_published ? "default" : "secondary"}
                        className="font-sans"
                      >
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-sans text-sm text-muted-foreground">
                      {formatDate(article.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublish(article)}
                          title={article.is_published ? 'Sembunyikan' : 'Publikasikan'}
                        >
                          {article.is_published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Link to={`/admin/articles/${article.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteArticle(article)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteArticle} onOpenChange={() => setDeleteArticle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Artikel "{deleteArticle?.title}" akan dihapus secara permanen. 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-sans">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-sans"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;