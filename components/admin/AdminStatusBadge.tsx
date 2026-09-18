type AdminStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "visible"
  | "hidden"
  | "completed"
  | "successful"
  | "active"
  | "inactive";

interface AdminStatusBadgeProps {
  status: AdminStatus;
  label?: string;
}

export default function AdminStatusBadge({
  status,
  label,
}: AdminStatusBadgeProps) {
  const styles: Record<AdminStatus, string> = {
    confirmed: "bg-green-100 text-green-700",
    visible: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    successful: "bg-green-100 text-green-700",
    active: "bg-green-100 text-green-700",

    pending: "bg-yellow-100 text-yellow-700",
    hidden: "bg-yellow-100 text-yellow-700",

    cancelled: "bg-red-100 text-red-700",
    inactive: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-md px-3 py-1 text-[11px] font-bold uppercase ${styles[status]}`}
    >
      {label ?? status}
    </span>
  );
}