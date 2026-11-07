// Shown where a register button would be while enrolment is closed (shared.json contact.registerOpen = false).
export default function Soon({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <span className={`soon${small ? " soon-sm" : ""}`}>
      <span className="soon-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
