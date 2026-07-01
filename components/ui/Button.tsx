import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "gradient-primary text-on-primary whisper-shadow hover:opacity-90 active:scale-95",
  secondary:
    "border border-primary/10 text-primary hover:bg-surface-container-low",
  tertiary: "text-secondary font-bold hover:text-primary",
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
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-bold font-manrope transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href } = props;
    return (
      <Link href={href} className={classes}>
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
    <button className={classes} {...buttonProps}>
      {children}
      {icon ? (
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
