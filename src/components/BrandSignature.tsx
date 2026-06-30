/**
 * Placeholder signature mark shown at the top of the sidebar.
 * Temporary hand-drawn SVG — will be replaced by an admin-uploaded
 * signature/logo image (Firebase) later.
 */
export default function BrandSignature({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 64"
      fill="none"
      className={className}
      role="img"
      aria-label="ABM Whaiduzzaman"
    >
      <path
        d="M8 46c10-30 22-34 26-18 3 13-6 30 2 30 9 0 14-30 22-29 8 1 4 27 13 27 13 0 12-31 24-29 9 2 4 28 14 28 12 0 14-28 26-27 9 1 5 26 14 26 8 0 13-16 21-18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 56c64 8 150 4 214-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}
