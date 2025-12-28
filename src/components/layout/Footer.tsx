import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { CATEGORIES } from '@/types/article';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-headline font-bold text-xl text-primary mb-4">
              <Newspaper className="h-6 w-6" />
              <span>OmniNews</span>
            </Link>
            <p className="font-body text-muted-foreground max-w-md">
              Portal berita modern dengan konten berkualitas dari media sosial, 
              disajikan dengan AI untuk keterbacaan maksimal.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4">Kategori</h4>
            <nav className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  to={`/?category=${cat.value}`}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-headline font-semibold text-foreground mb-4">Lainnya</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Tentang Kami
              </Link>
              <Link to="/contact" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Kontak
              </Link>
              <Link to="/privacy" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} OmniNews. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}