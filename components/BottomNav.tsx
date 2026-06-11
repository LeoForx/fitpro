"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12L12 3l9 9"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/treino",
    label: "Treino",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/dieta",
    label: "Dieta",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
        />
        <path
          d="M12 7v5l3 3"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 3.5C8.5 5 9 7 9 7h6s.5-2 1-3.5"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/agentes",
    label: "Agentes",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke={active ? "#2ffe1d" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="10" r="1" fill={active ? "#2ffe1d" : "#666"} />
        <circle cx="12" cy="10" r="1" fill={active ? "#2ffe1d" : "#666"} />
        <circle cx="15" cy="10" r="1" fill={active ? "#2ffe1d" : "#666"} />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/onboarding") return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="bottom-nav-safe fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(47,254,29,0.08)",
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="btn-press flex flex-col items-center gap-1 px-3 py-1 rounded-xl min-w-[64px]"
              style={{
                background: active ? "rgba(47,254,29,0.08)" : "transparent",
                textDecoration: "none",
              }}
            >
              <div>
                {item.icon(active)}
              </div>
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? "#2ffe1d" : "#666" }}
              >
                {item.label}
              </span>
              {active && (
                <div
                  className="absolute -bottom-0 h-0.5 w-8 rounded-full"
                  style={{ background: "#2ffe1d" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
