import Link from "next/link";
import AdminIcon from "./AdminIcon";
import StatusToggle from "./StatusToggle";
import { PageHeader, btnPrimary, btnGhost } from "./ui";
import type { PageStatus } from "@/lib/pageStatus";

/** Shared header for page editors: back link, title, status + View + Save actions. */
export default function EditorHeader({
  title,
  description,
  viewHref,
  onSave,
  saving,
  saved,
  status,
  onStatusChange,
}: {
  title: string;
  description: string;
  viewHref: string;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
  status?: PageStatus;
  onStatusChange?: (v: PageStatus) => void;
}) {
  return (
    <>
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>
      <PageHeader
        title={title}
        description={description}
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">
                Saved ✓
              </span>
            )}
            {status && onStatusChange && (
              <StatusToggle value={status} onChange={onStatusChange} />
            )}
            <Link href={viewHref} target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className={`${btnPrimary} disabled:opacity-60`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      />
    </>
  );
}
