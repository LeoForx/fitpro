"use client";

interface AnimatedCheckProps {
  visible: boolean;
  size?: number;
}

export default function AnimatedCheck({ visible, size = 32 }: AnimatedCheckProps) {
  if (!visible) return null;

  return (
    <div
      className="check-circle"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(47,254,29,0.15)",
        border: "2px solid #2ffe1d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 16px rgba(47,254,29,0.4)",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path
          className="check-path"
          d="M4 12l5 5 11-11"
          stroke="#2ffe1d"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
