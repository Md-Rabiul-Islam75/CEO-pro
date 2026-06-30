import { Card, PageHeader, btnPrimary } from "@/components/admin/ui";

const SOCIALS = ["X", "Facebook", "LinkedIn", "YouTube", "Instagram"];

function Field({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <input
        defaultValue={value}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
      />
    </label>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Global content that appears site-wide — sidebar, footer, and the top banner."
        action={
          <button type="button" className={btnPrimary}>
            Save changes
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top banner */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Top banner</h2>
          <div className="space-y-4">
            <Field label="Text" placeholder="e.g. Check out the new book!" />
            <Field label="Link" placeholder="https://…" />
          </div>
        </Card>

        {/* Newsletter */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Newsletter</h2>
          <div className="space-y-4">
            <Field label="Heading" value="Sign up for my weekly newsletter" />
            <Field label="Provider endpoint" placeholder="Mailchimp / ConvertKit URL" />
          </div>
        </Card>

        {/* Social links */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Social links</h2>
          <div className="space-y-3">
            {SOCIALS.map((s) => (
              <Field key={s} label={s} placeholder={`https://…`} />
            ))}
          </div>
        </Card>

        {/* SEO */}
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Site SEO</h2>
          <div className="space-y-4">
            <Field label="Default title" value="ABM Whaiduzzaman" />
            <Field
              label="Default description"
              value="Builds technology · trains entrepreneurs · creates brands"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
