import { Link } from 'react-router-dom';
import { Newspaper, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CATEGORIES } from '@/types/article';
import { useState } from 'react';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
          <Newspaper className="h-6 w-6" />
          <span>OmniNews</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/?category=${cat.value}`}
              className="font-sans text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden sm:flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <Input
                  type="search"
                  placeholder="Cari berita..."
                  className="w-48 h-9"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Admin Link */}
          <Link to="/admin">
            <Button variant="outline" size="sm" className="hidden sm:flex font-sans">
              Admin
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <Input type="search" placeholder="Cari berita..." className="w-full" />
                <nav className="flex flex-col gap-4">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      to={`/?category=${cat.value}`}
                      className="font-sans text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </nav>
                <Link to="/admin">
                  <Button variant="outline" className="w-full font-sans">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}