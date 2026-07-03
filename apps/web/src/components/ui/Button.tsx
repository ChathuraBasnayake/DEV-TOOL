"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export default function Button({
  children,
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  iconEnd,
  style,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Determine padding and font sizing based on size prop
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: "0.75rem", gap: "6px" },
    md: { padding: "8px 16px", fontSize: "0.82rem", gap: "8px" },
    lg: { padding: "10px 20px", fontSize: "0.9rem", gap: "10px" },
  };

  // Determine button colors and borders based on variant prop
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--accent-gradient)",
      color: "#ffffff",
      boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
    },
    secondary: {
      backgroundColor: "var(--bg-panel-solid)",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
    },
    danger: {
      backgroundColor: "var(--state-error-border)",
      color: "#ffffff",
    },
  };

  const isButtonDisabled = disabled || loading;

  return (
    <button
      disabled={isButtonDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-md)",
        fontWeight: 600,
        cursor: isButtonDisabled ? "not-allowed" : "pointer",
        opacity: isButtonDisabled ? 0.6 : 1,
        transition: "all var(--transition-speed) var(--transition-bezier)",
        outline: "none",
        border: "none",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      className={`ui-btn btn-${variant} ${className}`}
      onMouseOver={(e) => {
        if (isButtonDisabled) return;
        if (variant === "primary") {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.35)";
          e.currentTarget.style.opacity = "0.95";
        } else if (variant === "secondary" || variant === "ghost") {
          e.currentTarget.style.backgroundColor = "var(--bg-active)";
          e.currentTarget.style.borderColor = "var(--border-hover)";
        } else if (variant === "danger") {
          e.currentTarget.style.opacity = "0.9";
        }
      }}
      onMouseOut={(e) => {
        if (isButtonDisabled) return;
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.opacity = "1";
        if (variant === "primary") {
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
        } else if (variant === "secondary") {
          e.currentTarget.style.backgroundColor = "var(--bg-panel-solid)";
          e.currentTarget.style.borderColor = "var(--border-color)";
        } else if (variant === "ghost") {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "transparent";
        }
      }}
      {...props}
    >
      {/* Visual loading spinner */}
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            border: "2px solid currentColor",
            borderRightColor: "transparent",
            borderRadius: "50%",
            animation: "shimmerEffect 1s linear infinite", // fallback spin mapping
            marginRight: children ? "4px" : "0",
          }}
          className="ui-btn-spinner"
        />
      )}

      {!loading && icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
      {!loading && iconEnd && <span style={{ display: "inline-flex" }}>{iconEnd}</span>}
    </button>
  );
}
