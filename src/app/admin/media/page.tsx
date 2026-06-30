import AdminIcon from "@/components/admin/AdminIcon";
import { PageHeader, btnPrimary } from "@/components/admin/ui";

// Mock tiles — real uploads land here once Firebase Storage is wired up.
const TILES = [
  { label: "hero-portrait.jpg", tint: "from-brand-blue-soft to-brand-blue-tint", kind: "IMAGE" as const },
  { label: "story-1996.jpg", tint: "from-brand-green-soft to-brand-green-tint", kind: "IMAGE" as const },
  { label: "book-cover.png", tint: "from-amber-100 to-amber-50", kind: "IMAGE" as const },
  { label: "keynote-2025", tint: "from-slate-200 to-slate-100", kind: "VIDEO" as const },
  { label: "press-nrf.jpg", tint: "from-brand-blue-soft to-brand-blue-tint", kind: "IMAGE" as const },
  { label: "wallpaper-legacy.png", tint: "from-brand-green-soft to-brand-green-tint", kind: "IMAGE" as const },
];

export default function MediaPage() {
  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Images stored in Firebase and YouTube video references — reusable across all blocks."
        action={
          <button type="button" className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            Upload
          </button>
        }
      />

      <div className="mb-6 rounded-xl border border-dashed border-line bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-tint">
          <AdminIcon name="media" className="h-6 w-6 text-brand-green" />
        </span>
        <p className="mt-3 text-sm font-semibold text-ink">
          Drag &amp; drop images here
        </p>
        <p className="text-xs text-ink-faint">
          or paste a YouTube link to add a video — wired to Firebase later
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {TILES.map((t) => (
          <div
            key={t.label}
            className="group overflow-hidden rounded-xl border border-line bg-white"
          >
            <div
              className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${t.tint}`}
            >
              <AdminIcon
                name={t.kind === "VIDEO" ? "videos" : "wallpapers"}
                className="h-7 w-7 text-white/70"
              />
              <span className="absolute left-2 top-2 rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-ink-soft">
                {t.kind}
              </span>
            </div>
            <p className="truncate px-3 py-2 text-xs font-medium text-ink-soft">
              {t.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
