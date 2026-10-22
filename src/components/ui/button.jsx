// src/components/ui/Button.jsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",
    ghost: "hover:bg-slate-100 text-slate-600",
    glass: "glass text-white hover:bg-white/20",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-lg text-sm",
    lg: "h-12 px-8 rounded-full text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    />
  );
}