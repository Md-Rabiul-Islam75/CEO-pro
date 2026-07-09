"use client";

import { useState } from "react";
import { youtubeId } from "@/lib/siteSettings";

export type TheaterVideo = {
  id: string;
  title: string;
  video: string;
  thumbnail?: string;
};

/** YouTube-style player: a large main video + a clickable list of the rest. */
export default function VideoTheater({ videos }: { videos: TheaterVideo[] }) {
  const list = videos.filter((v) => youtubeId(v.video));
  const [active, setActive] = useState(0);

  if (list.length === 0) return null;

  const current = list[Math.min(active, list.length - 1)];
  const curId = youtubeId(current.video);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Main player */}
      <div className="min-w-0">
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-lg">
          <iframe
            key={curId}
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${curId}?rel=0&modestbranding=1&autoplay=1`}
            title={current.title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        {current.title && (
          <h3 className="mt-3 text-lg font-bold tracking-tight text-ink">
            {current.title}
          </h3>
        )}
      </div>

      {/* Up-next list */}
      {list.length > 1 && (
        <div className="scroll-slim lg:max-h-[420px] lg:overflow-y-auto lg:pr-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
            More talks
          </p>
          <div className="space-y-2">
            {list.map((v, i) => {
              const tid = youtubeId(v.video);
              const thumb =
                v.thumbnail || (tid ? `https://img.youtube.com/vi/${tid}/mqdefault.jpg` : "");
              const activeItem = i === active;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group flex w-full gap-3 rounded-xl border p-2 text-left transition-colors ${
                    activeItem
                      ? "border-brand-blue-soft bg-brand-blue-tint"
                      : "border-line bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={v.title} className="h-full w-full object-cover" />
                    ) : null}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-blue">
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="line-clamp-2 text-sm font-semibold text-ink">
                      {v.title || "Untitled"}
                    </span>
                    {activeItem && (
                      <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-brand-blue">
                        Now playing
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
