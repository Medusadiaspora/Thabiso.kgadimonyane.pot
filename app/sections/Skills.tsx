"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    category: "LANGUAGES_CORE",
    items: [
      { name: "TypeScript", level: 95 },
      { name: "JavaScript (ES6+)", level: 92 },
      { name: "C", level: 78 },
      { name: "SQL", level: 85 },
      { name: "Spanish", level: 35, note: "BEGINNER" },
    ],
    color: "cyan",
  },
  {
    category: "FRONTEND_STACK",
    items: [
      { name: "React", level: 90 },
      { name: "Next.js (App Router)", level: 94 },
      { name: "Tailwind CSS", level: 96 },
      { name: "Catalyst UI", level: 80 },
      { name: "Dark Mode Architecture", level: 88 },
    ],
    color: "pink",
  },
  {
    category: "BACKEND_SYSTEMS",
    items: [
      { name: "Node.js", level: 88 },
      { name: "Prisma ORM", level: 86 },
      { name: "PostgreSQL", level: 84 },
      { name: "MySQL", level: 82 },
      { name: "Clerk Auth", level: 90 },
    ],
    color: "purple",
  },
  {
    category: "CLOUD_DEVOPS",
    items: [
      { name: "AWS (S3, RDS, EC2)", level: 75 },
      { name: "Git/GitHub", level: 92 },
      { name: "Linux (Mint)", level: 70 },
      { name: "UTM Virtualization", level: 68 },
    ],
    color: "green",
  },
  {
    category: "SPECIALIZED_TOOLS",
    items: [
      { name: "Paystack Integration", level: 88 },
      { name: "Postman", level: 85 },
      { name: "Vercel", level: 90 },
    ],
    color: "yellow",
  },
  {
    category: "AI_AGENTIC_STACK",
    items: [
      { name: "Gemini AI / 3 Flash", level: 82 },
      { name: "Cursor IDE", level: 90 },
      { name: "Codex", level: 80 },
      { name: "X402", level: 70 },
      { name: "Arc + Circle", level: 75 },
      { name: "Featherless", level: 65 },
    ],
    color: "orange",
  },
];

const colorMap: Record<
  string,
  { bar: string; glow: string; text: string; border: string; hex: string }
> = {
  cyan: {
    bar: "bg-cyan-400",
    glow: "shadow-[0_0_15px_#00f3ff]",
    text: "text-cyan-400",
    border: "border-cyan-400/30 hover:border-cyan-400",
    hex: "#00f3ff",
  },
  pink: {
    bar: "bg-pink-500",
    glow: "shadow-[0_0_15px_#ff00ff]",
    text: "text-pink-500",
    border: "border-pink-500/30 hover:border-pink-500",
    hex: "#ff00ff",
  },
  purple: {
    bar: "bg-purple-400",
    glow: "shadow-[0_0_15px_#a855f7]",
    text: "text-purple-400",
    border: "border-purple-400/30 hover:border-purple-400",
    hex: "#a855f7",
  },
  green: {
    bar: "bg-green-400",
    glow: "shadow-[0_0_15px_#22c55e]",
    text: "text-green-400",
    border: "border-green-400/30 hover:border-green-400",
    hex: "#22c55e",
  },
  yellow: {
    bar: "bg-yellow-400",
    glow: "shadow-[0_0_15px_#facc15]",
    text: "text-yellow-400",
    border: "border-yellow-400/30 hover:border-yellow-400",
    hex: "#facc15",
  },
  orange: {
    bar: "bg-orange-400",
    glow: "shadow-[0_0_15px_#fb923c]",
    text: "text-orange-400",
    border: "border-orange-400/30 hover:border-orange-400",
    hex: "#fb923c",
  },
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance with gasp effect
      gsap.fromTo(
        headerRef.current,
        {
          scale: 0.3,
          opacity: 0,
          filter: "blur(30px) brightness(0.2)",
          y: 100,
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px) brightness(1)",
          y: 0,
          duration: 1.8,
          ease: "elastic.out(1, 0.3)",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Each card explodes in with crazy stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const direction = i % 2 === 0 ? -1 : 1;

        gsap.fromTo(
          card,
          {
            x: direction * 200,
            rotateY: direction * 45,
            rotateZ: direction * 10,
            scale: 0.5,
            opacity: 0,
            filter: "blur(15px) brightness(0.3)",
          },
          {
            x: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px) brightness(1)",
            duration: 1.4,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 30%",
              toggleActions: "play none none reverse",
              scrub: 0.5,
            },
          },
        );

        // Inner skill bars animate on scroll
        const bars = card.querySelectorAll(".skill-bar-fill");
        const labels = card.querySelectorAll(".skill-percent");

        bars.forEach((bar, j) => {
          const level = skillCategories[i].items[j].level;
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${level}%`,
              duration: 1.5,
              ease: "circ.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
              delay: j * 0.1,
            },
          );
        });

        labels.forEach((label, j) => {
          gsap.fromTo(
            label,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "back.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
              delay: j * 0.1 + 0.3,
            },
          );
        });
      });

      // Progress bar at bottom tracks scroll
      gsap.to(progressRef.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Parallax floating elements
      gsap.utils.toArray(".float-orb").forEach((orb: any, i) => {
        gsap.to(orb, {
          y: -150 - i * 50,
          rotate: 360,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-32 px-4 z-10 min-h-[200vh]"
    >
      {/* Floating orbs for parallax */}
      <div className="float-orb absolute top-20 left-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="float-orb absolute top-1/3 right-20 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
      <div className="float-orb absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 z-[100]"
        ref={progressRef}
        style={{ width: "0%" }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-24 text-center relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="text-[10px] font-mono text-cyan-500 tracking-[0.5em] border border-cyan-500/30 px-4 py-2 mb-6 block w-fit mx-auto">
              SYSTEM_DIAGNOSTIC_RUNNING
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-glow-cyan glitch-hover cursor-default">
            VERIFIED_ARSENAL
          </h2>

          <p className="text-gray-400 font-mono text-sm tracking-widest mb-4">
            &gt; EXTRACTED_FROM_CV_AND_CERTIFICATES
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono text-gray-600">
            <span className="border border-gray-800 px-3 py-1 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
              HARVARD_CS50x: COMPLETE
            </span>
            <span className="border border-gray-800 px-3 py-1 hover:border-pink-400 hover:text-pink-400 transition-colors">
              GIRLCODE_HACKATHON: 2022-2024
            </span>
            <span className="border border-gray-800 px-3 py-1 hover:border-green-400 hover:text-green-400 transition-colors">
              LABLAB.ai: AGENTIC_ECONOMY
            </span>
            <span className="border border-gray-800 px-3 py-1 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
              SARS_REG: 2274397195
            </span>
          </div>

          {/* Decorative line */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-cyan-400" />
            <div className="w-2 h-2 rotate-45 bg-cyan-400 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-pink-500" />
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {skillCategories.map((cat, i) => {
            const colors = colorMap[cat.color];

            return (
              <div
                key={cat.category}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated glow backdrop */}
                <div
                  className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.hex}40, transparent)`,
                  }}
                />

                <div
                  className={`relative border ${colors.border} bg-black/80 backdrop-blur-md p-8 h-full transition-all duration-500 group-hover:scale-[1.02]`}
                >
                  {/* Corner accents */}
                  <div
                    className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${colors.text.replace("text", "border")} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${colors.text.replace("text", "border")} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Category header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                    <h3
                      className={`text-xl font-black tracking-widest ${colors.text} group-hover:text-white transition-colors duration-300`}
                    >
                      {cat.category}
                    </h3>
                    <span className="text-[9px] font-mono text-gray-600 border border-gray-800 px-2 py-1">
                      SYS.{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Skills list */}
                  <div className="space-y-5">
                    {cat.items.map((item, j) => (
                      <div key={item.name} className="group/skill">
                        <div className="flex justify-between items-end mb-2">
                          <span
                            className={`text-sm font-bold tracking-wider ${colors.text} group-hover/skill:text-white transition-colors`}
                          >
                            {item.name}
                          </span>
                          <span className="skill-percent text-[10px] font-mono text-gray-500 opacity-0">
                            {item.note ? `[${item.note}]` : `${item.level}%`}
                          </span>
                        </div>

                        <div className="relative h-2 bg-gray-900 overflow-hidden">
                          <div
                            className={`skill-bar-fill absolute inset-y-0 left-0 ${colors.bar} ${colors.glow}`}
                            style={{ width: "0%" }}
                          />
                          <div className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />

                          {/* Scan line */}
                          <div
                            className="absolute inset-y-0 w-1 bg-white/50"
                            style={{
                              animation: "scan 2s linear infinite",
                              left: "0%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-600">
                      MODULES_LOADED: {cat.items.length}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, k) => (
                        <div
                          key={k}
                          className={`w-1.5 h-1.5 rounded-full ${colors.bar} ${colors.glow}`}
                          style={{ animationDelay: `${k * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hover data readout */}
                  <div
                    className={`absolute -right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity writing-mode-vertical`}
                  >
                    {colors.hex.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom stats panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 p-8 border border-gray-800 bg-black/60 backdrop-blur relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-pink-500/5" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-cyan-400 text-glow-cyan mb-2">
                06
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                CATEGORY_CLUSTERS
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-pink-500 text-glow-pink mb-2">
                28
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                SKILL_MODULES
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">04</div>
              <div className="text-[10px] font-mono text-gray-500">
                CERTIFICATES
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-400 mb-2">∞</div>
              <div className="text-[10px] font-mono text-gray-500">
                POTENTIAL
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap justify-center gap-3">
            {[
              "WEB3.0_HACKATHON",
              "GIRLCODE_CLUB_2023-2024",
              "NATIVELYAI_LABLAB",
              "CS50X_HARVARD",
              "SARS_COMPLIANT",
            ].map((badge) => (
              <span
                key={badge}
                className="text-[9px] font-mono text-gray-500 border border-gray-800 px-3 py-1 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-default"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Terminal command prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs font-mono text-gray-600">
            <span className="text-cyan-400">➜</span>{" "}
            <span className="text-green-400">~</span>{" "}
            <span className="text-pink-400">skills</span> --verify --all
          </p>
          <p className="text-[10px] font-mono text-gray-700 mt-1">
            [OK] All modules verified. Ready for deployment.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
}
