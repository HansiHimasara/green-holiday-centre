export default function AdminFooter() {
  return (
    <footer className="flex h-[58px] items-center justify-between border-t border-[var(--border-light)] bg-white px-10 text-xs text-[var(--text-secondary)]">
      <p>
        © 2026 Green Holiday (Pvt) Ltd. All Rights Reserved. Internal Management
        console.
      </p>

      <div className="flex items-center gap-7">
        <span>Security Policy</span>
        <span>System Logs</span>
        <span>v2.4.1-Stable</span>
      </div>
    </footer>
  );
}