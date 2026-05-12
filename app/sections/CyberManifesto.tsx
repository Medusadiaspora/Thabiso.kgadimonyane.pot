"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manifestoLines = [
  "THE SYSTEM WASN'T BUILT FOR US.",
  "SO WE BUILT OUR OWN.",
  "",
  "EVERY LINE OF CODE IS A REVOLUTION.",
  "EVERY DEPLOYMENT, A DECLARATION.",
  "",
  "FROM TEMBISA TO THE MAINFRAME —",
  "WE DON'T ASK PERMISSION.",
  "WE COMPILE DESTINY.",
  "",
  "THE FUTURE ISN'T WAITING.",
  "NEITHER AM I.",
  "",
  "> THABISO C. KGADIMONYANE",
  "> FULLSTACK ENGINEER // JHB_ZA",
  "> STATUS: ALWAYS_BUILDING",
];

export default function CyberManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  // Typewriter reveal with GSAP
  useEffect(() => {
    if (!isInView) return;

    const lines = textRef.current?.querySelectorAll(".manifesto-line");
    if (!lines) return;

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          {
            opacity: 0,
            x: -50,
            skewX: 10,
            filter: "blur(10px) brightness(2)",
          },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            filter: "blur(0px) brightness(1)",
            duration: 0.8,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Psycho background pulse
      gsap.to(".manifesto-bg", {
        backgroundPosition: "200% 200%",
        duration: 10,
        ease: "none",
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isInView]);

  // Random glitch trigger
  useEffect(() => {
    const interval = setInterval(
      () => {
        const lines = document.querySelectorAll(".manifesto-line");
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        if (randomLine) {
          randomLine.classList.add("glitch-active");
          setTimeout(() => randomLine.classList.remove("glitch-active"), 200);
        }
      },
      2000 + Math.random() * 3000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-40 px-4 z-10 min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div
        className="manifesto-bg absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(0,243,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(255,0,255,0.15) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating code debris */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[8px] font-mono pointer-events-none select-none"
          style={{
            left: `${i * 7.5 * 100}%`,
            top: `${i * 12.5 * 100}%`,
            color:
              i % 2 === 0 ? "rgba(0,243,255,0.15)" : "rgba(255,0,255,0.15)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          {
            [
              "{",
              "}",
              "<",
              ">",
              "/",
              "*",
              "0",
              "1",
              "null",
              "void",
              "true",
              "false",
              "=>",
            ][i]
          }
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="mb-12 text-center"
        >
          <span className="inline-block text-[10px] font-mono text-cyan-500 tracking-[0.5em] border border-cyan-500/30 px-4 py-2 mb-6">
            MANIFESTO.EXE // CLASSIFIED
          </span>
        </motion.div>

        {/* The manifesto text */}
        <div ref={textRef} className="space-y-2 relative">
          {manifestoLines.map((line, i) => (
            <div
              key={i}
              className={`manifesto-line relative ${line === "" ? "h-4" : ""}`}
            >
              {line.startsWith(">") ? (
                <p className="text-sm md:text-base font-mono text-cyan-400 tracking-wider pl-4 border-l-2 border-cyan-400/50">
                  {line}
                </p>
              ) : line === "" ? null : (
                <p
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                    i < 4
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
                      : i < 8
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500"
                        : "text-white"
                  }`}
                >
                  {line}
                </p>
              )}

              {/* Glitch overlay */}
              <span
                className="glitch-clone absolute inset-0 text-pink-500 opacity-0 pointer-events-none"
                aria-hidden
              >
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* Signature block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <p className="text-[10px] font-mono text-gray-600 mb-1">
              DIGITAL_SIGNATURE
            </p>
            <p className="text-xl font-black text-cyan-400 text-glow-cyan">
              T.C.K.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.div
              className="w-12 h-12 border border-cyan-400/30 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ type: "spring" }}
            >
              <span className="text-cyan-400 text-xs font-mono">&lt;/&gt;</span>
            </motion.div>
            <motion.div
              className="w-12 h-12 border border-pink-500/30 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: -90 }}
              transition={{ type: "spring" }}
            >
              <span className="text-pink-500 text-xs font-mono">{"{ }"}</span>
            </motion.div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] font-mono text-gray-600 mb-1">
              TIMESTAMP
            </p>
            <p className="text-sm font-mono text-pink-400">
              {new Date().toISOString().split("T")[0]} // JHB_ZA
            </p>
          </div>
        </motion.div>

        {/* Rotating seal */}
        <motion.div
          className="absolute -top-8 -right-8 md:right-0 w-24 h-24 border border-cyan-400/20 rounded-full flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 border border-pink-500/20 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border border-cyan-400/30 rounded-full flex items-center justify-center">
              <span className="text-[8px] font-mono text-cyan-400 text-center leading-tight">
                AUTH
                <br />
                ENTIC
                <br />
                ATED
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .manifesto-line {
          transition: transform 0.1s;
        }
        .manifesto-line.glitch-active {
          transform: translateX(2px);
          animation: manifestoGlitch 0.2s ease;
        }
        .manifesto-line.glitch-active .glitch-clone {
          opacity: 0.8;
          transform: translateX(-4px);
          clip-path: inset(30% 0 50% 0);
        }
        @keyframes manifestoGlitch {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-3px);
          }
          50% {
            transform: translateX(3px);
          }
          75% {
            transform: translateX(-1px);
          }
        }
      `}</style>
    </section>
  );
}
