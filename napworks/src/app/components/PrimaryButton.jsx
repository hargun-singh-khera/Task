"use client";

import Link from "next/link";

export function PrimaryButton({
  href,
  children,
  className = "",
  ...props
}) {
  const classes =
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#246bfe] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1558dc]";

  if (href) {
    return (
      <Link
        href={href}
        className={`${classes} ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`${classes} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}