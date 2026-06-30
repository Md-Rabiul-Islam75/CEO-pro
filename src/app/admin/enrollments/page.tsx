import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader, StatusPill } from "@/components/admin/ui";

type Status = "NEW" | "CONTACTED" | "ENROLLED";

type Enrollment = {
  name: string;
  email: string;
  whatsapp: string;
  program: string;
  date: string;
  status: Status;
};

// Mock submissions from the Book-a-Session form. DB-backed later.
const ENROLLMENTS: Enrollment[] = [
  { name: "Rakib Hasan", email: "rakib@example.com", whatsapp: "+880 1712 345678", program: "One-Focus", date: "Jun 29, 2026", status: "NEW" },
  { name: "Aisha Karim", email: "aisha@example.com", whatsapp: "+880 1819 222333", program: "One-Focus", date: "Jun 28, 2026", status: "CONTACTED" },
  { name: "Tanvir Ahmed", email: "tanvir@example.com", whatsapp: "+880 1911 555777", program: "One-Focus", date: "Jun 26, 2026", status: "ENROLLED" },
];

const STATUS_PILL: Record<Status, "draft" | "blue" | "active"> = {
  NEW: "draft",
  CONTACTED: "blue",
  ENROLLED: "active",
};

export default function EnrollmentsPage() {
  return (
    <div>
      <PageHeader
        title="Enrollments"
        description="Submissions from the Book-a-Session form on program pages. Reach out via WhatsApp and track status."
      />

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="hidden px-4 py-2.5 md:table-cell">Contact</th>
              <th className="hidden px-4 py-2.5 sm:table-cell">Program</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ENROLLMENTS.map((e, i) => (
              <tr key={i} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{e.name}</p>
                  <p className="text-xs text-ink-faint md:hidden">{e.whatsapp}</p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <p className="text-ink-soft">{e.email}</p>
                  <a
                    href={`https://wa.me/${e.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-green hover:underline"
                  >
                    <AdminIcon name="external" className="h-3.5 w-3.5" />
                    {e.whatsapp}
                  </a>
                </td>
                <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">
                  {e.program}
                </td>
                <td className="px-4 py-3">
                  <StatusPill variant={STATUS_PILL[e.status]}>{e.status}</StatusPill>
                </td>
                <td className="px-4 py-3 text-right text-ink-soft">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-4 text-xs text-ink-faint">
        The WhatsApp number links straight to a chat (wa.me) so you can follow up
        in one click. Status: NEW → CONTACTED → ENROLLED.
      </p>
    </div>
  );
}
