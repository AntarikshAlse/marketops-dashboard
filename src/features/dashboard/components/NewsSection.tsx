import { IconExternalLink } from '@tabler/icons-react';

export interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface NewsSectionProps {
  news: NewsItem[];
}

export function NewsSection({ news }: NewsSectionProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Latest News</h2>
      </div>

      {news.length === 0 && <div className="p-4 text-muted-foreground">No news found</div>}

      <div className="flex-1 overflow-y-auto">
        {news.slice(0, 5).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group flex gap-3 border-b border-border p-3 transition-colors hover:bg-accent/40"
          >
            <img
              src={item.image}
              alt={item.headline}
              className="h-20 w-28 flex-shrink-0 rounded-md object-contain"
              loading="lazy"
            />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{item.source}</span>

                <span className="text-xs text-muted-foreground">
                  {new Date(item.datetime * 1000).toLocaleDateString()}
                </span>
              </div>

              <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{item.headline}</h3>

              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>

              <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                Read More
                <IconExternalLink size={12} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
