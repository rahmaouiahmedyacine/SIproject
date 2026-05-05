import React from 'react'

export default function StatusBadge({ status, t }) {
  const cfg = {
    pending:  { bg: "#f59e0b22", color: "#f59e0b", label: t('pending') },
    accepted: { bg: "#10b98122", color: "#10b981", label: t('approved') },
    approved: { bg: "#10b98122", color: "#10b981", label: t('approved') },
    rejected: { bg: "#ef444422", color: "#ef4444", label: t('rejected') },
  }[status] || { bg: "#33415522", color: "#94a3b8", label: status };

  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      {cfg.label}
    </span>
  );
}
