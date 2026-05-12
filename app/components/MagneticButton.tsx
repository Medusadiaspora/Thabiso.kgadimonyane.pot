"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "cyan" | "pink" | "ghost";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  variant = "cyan",
  className = "",
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const colorClasses = {
    cyan: "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]",
    pink: "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black shadow-[0_0_20px_rgba(255,0,255,0.3)]",
    ghost: "border-gray-600 text-gray-400 hover:border-white hover:text-white",
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.4;
    const y = (e.clientY - top - height / 2) * 0.4;

    gsap.to(ref.current, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const baseClasses = `relative px-8 py-4 font-bold uppercase tracking-[0.2em] text-sm border-2 bg-black/40 backdrop-blur-md overflow-hidden group transition-all duration-300 ${colorClasses[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        ref={ref as any}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.92 }}
        className={baseClasses}
      >
        <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as any}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.92 }}
      className={baseClasses}
    >
      <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
