import { isSocialUrl } from '@/lib/utils';

interface SocialEmbedProps {
  url: string;
}

export function SocialEmbed({ url }: SocialEmbedProps) {
  const { isTikTok, isInstagram } = isSocialUrl(url);

  if (isTikTok) {
    // Extract TikTok video ID and create embed
    const tiktokMatch = url.match(/video\/(\d+)/);
    const videoId = tiktokMatch ? tiktokMatch[1] : null;

    if (videoId) {
      return (
        <div className="my-8 flex justify-center">
          <div className="w-full max-w-md aspect-[9/16] bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.tiktok.com/embed/v2/${videoId}`}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      );
    }
  }

  if (isInstagram) {
    // Extract Instagram post ID
    const igMatch = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
    const postId = igMatch ? igMatch[2] : null;

    if (postId) {
      return (
        <div className="my-8 flex justify-center">
          <div className="w-full max-w-lg">
            <iframe
              src={`https://www.instagram.com/p/${postId}/embed`}
              className="w-full aspect-square rounded-lg"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
  }

  // Fallback: just show a link
  return (
    <div className="my-8 p-4 bg-secondary rounded-lg">
      <p className="font-body text-sm text-muted-foreground mb-2">Sumber video:</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-sans text-sm break-all"
      >
        {url}
      </a>
    </div>
  );
}