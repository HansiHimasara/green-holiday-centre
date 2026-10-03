"use client";

import { apiFetch as fetch } from "@/src/client/apiFetch";
import { useEffect, useState, type FormEvent } from "react";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Admin = { id: number; fullName: string; username: string; email: string; status: string };
export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function reload() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load administrators.");
    setAdmins(data.admins);
  }
  // eslint-disable-next-line react-hooks/set-state-in-effect -- This loader updates state only after its asynchronous fetch.
  useEffect(() => { reload().catch(error => setMessage(error.message)); }, []);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create administrator.");
      form.reset(); await reload(); setMessage(data.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create administrator."); }
    finally { setBusy(false); }
  }
  async function remove(admin: Admin) {
    if (busy || !window.confirm(`Delete administrator ${admin.fullName}?`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/users/${admin.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete administrator.");
      await reload(); setMessage(data.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to delete administrator."); }
    finally { setBusy(false); }
  }
  return <AdminPageLayout sectionTitle="Admin Accounts" adminAccountsOpen>
    <AdminPageHeader title="Admin Accounts" description="Create and manage administrator access." />
    <form onSubmit={create} className="mt-7 rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-[0_8px_25px_rgba(7,91,69,0.05)]">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input label="Full Name" name="fullName" required maxLength={120} />
        <Input label="Username" name="username" required minLength={3} maxLength={50} pattern="[a-zA-Z0-9_.\-]+" />
        <Input label="Email" name="email" type="email" required />
        <Input label="Temporary Password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="mt-5"><Button type="submit" disabled={busy}>{busy ? "Please wait..." : "Create Admin"}</Button></div>
    </form>
    {message && <p role="status" className="mt-4 text-sm font-semibold text-[var(--green-dark)]">{message}</p>}
    <div className="mt-7 overflow-x-auto rounded-xl border border-[var(--border-light)] bg-white">
      <AdminTable><thead><tr className="bg-[var(--surface-soft)]">
        {["Name", "Username", "Email", "Status", "Actions"].map(label => <th key={label} className="px-5 py-3 text-left text-[10px] font-extrabold uppercase text-[var(--text-secondary)]">{label}</th>)}
      </tr></thead><tbody>
        {admins.map(admin => <tr key={admin.id} className="border-t border-[var(--border-light)]">
          {[admin.fullName, admin.username, admin.email, admin.status].map((value, i) => <td key={i} className="px-5 py-4 text-[13px]">{value}</td>)}
          <td className="px-5 py-4"><Button variant="outline" disabled={busy} onClick={() => void remove(admin)}>Delete</Button></td>
        </tr>)}
        {!admins.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-[12px] text-[var(--text-muted)]">No administrator accounts available.</td></tr>}
      </tbody></AdminTable>
    </div>
  </AdminPageLayout>;
}
