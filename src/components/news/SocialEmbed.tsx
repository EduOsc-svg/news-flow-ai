import { useEffect, useRef, useState } from 'react';
import { isSocialUrl } from '@/lib/utils';

interface SocialEmbedProps {
  url: string;
}

export function SocialEmbed({ url }: SocialEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isTikTok, isInstagram } = isSocialUrl(url);

  useEffect(() => {
    // Reset loaded state when URL changes
    setIsLoaded(false);

    const loadEmbed = () => {
      if (isTikTok) {
        const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://www.tiktok.com/embed.js';
          script.async = true;
          script.onload = () => {
            setIsLoaded(true);
            setTimeout(() => {
              if ((window as any).tiktokEmbed?.lib?.render) {
                (window as any).tiktokEmbed.lib.render();
              }
            }, 100);
          };
          document.body.appendChild(script);
        } else {
          setIsLoaded(true);
          setTimeout(() => {
            if ((window as any).tiktokEmbed?.lib?.render) {
              (window as any).tiktokEmbed.lib.render();
            }
          }, 100);
        }
      }

      if (isInstagram) {
        const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => {
            setIsLoaded(true);
            setTimeout(() => {
              if ((window as any).instgrm?.Embeds?.process) {
                (window as any).instgrm.Embeds.process();
              }
            }, 100);
          };
          document.body.appendChild(script);
        } else {
          setIsLoaded(true);
          setTimeout(() => {
            if ((window as any).instgrm?.Embeds?.process) {
              (window as any).instgrm.Embeds.process();
            }
          }, 100);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadEmbed, 50);
    return () => clearTimeout(timer);
  }, [isTikTok, isInstagram, url]);

  if (isTikTok) {
    const videoId = url.match(/video\/(\d+)/)?.[1] || '';
    
    return (
      <div className="my-8 flex justify-center" ref={containerRef}>
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={videoId}
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