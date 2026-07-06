export const fmtUGX = (n: number) => {
  if (n >= 1_000_000_000) return `UGX ${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `UGX ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `UGX ${(n / 1_000).toFixed(0)}K`;
  return `UGX ${n.toLocaleString()}`;
};

export const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const daysBetween = (iso: string) => {
  return Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
};

export const relativeTime = (iso: string) => {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.round(diff / 7)}w ago`;
  return `${Math.round(diff / 30)}mo ago`;
};
