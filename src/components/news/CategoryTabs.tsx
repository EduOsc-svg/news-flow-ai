import { useSearchParams, Link } from 'react-router-dom';
import { CATEGORIES, type Category } from '@/types/article';
import { cn } from '@/lib/utils';

export function CategoryTabs() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') as Category | null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      <Link
        to="/"
        className={cn(
          "px-4 py-2 rounded-full font-sans text-sm font-medium whitespace-nowrap transition-colors",
          !currentCategory
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Semua
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.value}
          to={`/?category=${cat.value}`}
          className={cn(
            "px-4 py-2 rounded-full font-sans text-sm font-medium whitespace-nowrap transition-colors",
            currentCategory === cat.value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}