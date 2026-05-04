import { useEffect, useRef, useState } from 'react';
import { Eye, Heart, Share2 } from 'lucide-react';

interface Props {
  slug: string;
  title: string;
  url: string;
}

interface CountResp {
  count: number;
  configured?: boolean;
  alreadyLiked?: boolean;
  counted?: boolean;
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export default function PostEngagement({ slug, title, url }: Props) {
  const [likes, setLikes] = useState<number | null>(null);
  const [views, setViews] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [shared, setShared] = useState(false);
  const heartRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const cookieFlag = document.cookie.includes(`liked-${encodeURIComponent(slug)}=1`);
    if (cookieFlag) setLiked(true);

    let cancelled = false;
    (async () => {
      try {
        const [likeRes, viewRes] = await Promise.all([
          fetch(`/api/likes/${slug}`).then((r) => r.json() as Promise<CountResp>),
          fetch(`/api/views/${slug}`, { method: 'POST' }).then((r) => r.json() as Promise<CountResp>),
        ]);
        if (cancelled) return;
        setLikes(likeRes.configured === false ? null : likeRes.count);
        setViews(viewRes.configured === false ? null : viewRes.count);
      } catch {
        if (!cancelled) {
          setLikes(null);
          setViews(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleLike = async () => {
    if (liked || pending) return;
    setPending(true);
    setLiked(true);
    setLikes((c) => (c == null ? 1 : c + 1));
    heartRef.current?.classList.remove('animate-heart-pop');
    void heartRef.current?.offsetWidth;
    heartRef.current?.classList.add('animate-heart-pop');

    try {
      const res = await fetch(`/api/likes/${slug}`, { method: 'POST' });
      const data = (await res.json()) as CountResp;
      if (data.configured === false) {
        setLikes(null);
        setLiked(false);
      } else {
        setLikes(data.count);
      }
    } catch {
      setLiked(false);
      setLikes((c) => (c == null ? null : Math.max(0, c - 1)));
    } finally {
      setPending(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = url;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {}
  };

  const showLikes = likes != null;
  const showViews = views != null;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 font-mono text-sm">
      <button
        ref={heartRef}
        type="button"
        onClick={handleLike}
        disabled={liked || pending}
        aria-label={liked ? 'Already liked' : 'Like this post'}
        className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
          liked
            ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:border-rose-500/40'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        <span>{showLikes ? formatCount(likes) : '—'}</span>
      </button>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
        <Eye className="w-4 h-4" />
        <span>{showViews ? formatCount(views) : '—'} views</span>
      </div>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this post"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-emerald-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>{shared ? 'copied' : 'share'}</span>
      </button>

      {!showLikes && !showViews && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          (engagement counters activate once Upstash Redis env vars are set)
        </span>
      )}
    </div>
  );
}
