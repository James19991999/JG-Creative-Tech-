"use client";

import Link from "next/link";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "gradient-primary text-on-primary whisper-shadow hover:opacity-90 active:scale-95",
  secondary:
    "border border-primary/10 text-ink hover:bg-surface-container-low",
  tertiary: "text-secondary font-bold hover:text-ink",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Shared CTA button. Renders as a Next.js Link when `href` is provided,
 * otherwise as a native <button>. Covers the three button treatments
 * used throughout the Stitch screens: gradient primary, ghost-border
 * secondary, and text-only tertiary with a trailing icon.
 *
 * Primary-variant buttons get a subtle magnetic-hover pull toward the
 * cursor - the site's one contained "spend the boldness here" motion
 * detail, scoped to primary only (not secondary/tertiary) so it reads
 * as a deliberate accent rather than a default applied everywhere.
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  const isMagnetic = variant === "primary";

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!isMagnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const strength = 0.25;
    const maxOffset = 8;
    setMagnetOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, relX * strength)),
      y: Math.max(-maxOffset, Math.min(maxOffset, relY * strength)),
    });
  }

  function handleMouseLeave() {
    if (!isMagnetic) return;
    setMagnetOffset({ x: 0, y: 0 });
  }

  const magneticProps = isMagnetic
    ? {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: {
          transform: `translate(${magnetOffset.x}px, ${magnetOffset.y}px)`,
        },
      }
    : {};

  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-bold font-manrope transition-all ${isMagnetic ? "duration-200 ease-out" : ""} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href } = props;
    return (
      <Link href={href} className={classes} {...magneticProps}>
        {children}
        {icon ? (
          <span className="material-symbols-outlined text-lg" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      {...buttonProps}
      {...magneticProps}
      style={{ ...buttonProps.style, ...magneticProps.style }}
    >
      {children}
      {icon ? (
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
