import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function extractExcerpt(content: string, maxLength: number = 150): string {
  // Remove HTML tags if any
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
}

export function isSocialUrl(url: string): { isTikTok: boolean; isInstagram: boolean } {
  const lowercaseUrl = url.toLowerCase();
  return {
    isTikTok: lowercaseUrl.includes('tiktok.com'),
    isInstagram: lowercaseUrl.includes('instagram.com') || lowercaseUrl.includes('instagr.am'),
  };
}