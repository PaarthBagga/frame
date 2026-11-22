export function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function shortDate(iso?: string): string {
  if (!iso) return "—";
  // A plain "YYYY-MM-DD" is a calendar day, not a moment in time. Parse it as
  // local so it doesn't show a day early west of UTC.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function relTime(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  const days = Math.round(diff / day);
  if (Math.abs(days) >= 1) return days === 0 ? "today" : days > 0 ? `${days}d ago` : `in ${-days}d`;
  const hours = Math.round(diff / 3600000);
  if (Math.abs(hours) >= 1) return `${hours}h ago`;
  const mins = Math.max(1, Math.round(diff / 60000));
  return `${mins}m ago`;
}
