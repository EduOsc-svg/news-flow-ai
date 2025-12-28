import { useEffect, useRef } from 'react';
import { isSocialUrl } from '@/lib/utils';

interface SocialEmbedProps {
  url: string;
}

export function SocialEmbed({ url }: SocialEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTikTok, isInstagram } = isSocialUrl(url);

  useEffect(() => {
    if (isTikTok) {
      // Load TikTok embed script
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // Re-process embeds if script already loaded
        if ((window as any).tiktokEmbed?.lib?.render) {
          (window as any).tiktokEmbed.lib.render();
        }
      }
    }

    if (isInstagram) {
      // Load Instagram embed script
      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // Re-process embeds if script already loaded
        if ((window as any).instgrm?.Embeds?.process) {
          (window as any).instgrm.Embeds.process();
        }
      }
    }
  }, [isTikTok, isInstagram, url]);

  if (isTikTok) {
    return (
      <div className="my-8 flex justify-center" ref={containerRef}>
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={url.match(/video\/(\d+)/)?.[1] || ''}
          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section>
            <a target="_blank" href={url} rel="noopener noreferrer">
              Lihat video di TikTok
            </a>
          </section>
        </blockquote>
      </div>
    );
  }

  if (isInstagram) {
    const postId = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)?.[2];
    const embedUrl = postId ? `https://www.instagram.com/p/${postId}/` : url;
    
    return (
      <div className="my-8 flex justify-center" ref={containerRef}>
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={embedUrl}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: 0,
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '540px',
            minWidth: '326px',
            padding: 0,
            width: '99.375%',
          }}
        >
          <a href={embedUrl} target="_blank" rel="noopener noreferrer">
            Lihat postingan di Instagram
          </a>
        </blockquote>
      </div>
    );
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