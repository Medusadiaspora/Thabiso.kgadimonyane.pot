"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import MagneticButton from "../components/MagneticButton";

const contactData = [
  { label: "OPERATIVE", value: "THABISO CARLTON KGADIMONYANE", type: "text" },
  { label: "LOCATION", value: "JOHANNESBURG, ZA", type: "text" },
  {
    label: "EMAIL",
    value: "thabisokgadimonyane@icloud.com",
    type: "email",
    href: "mailto:thabisokgadimonyane@icloud.com",
  },
  {
    label: "COMMS",
    value: "078 150 5500",
    type: "tel",
    href: "tel:+27781505500",
  },
  {
    label: "WHATSAPP",
    value: "+27 78 150 5500",
    type: "whatsapp",
    href: "https://wa.me/27781505500?text=Yo%20Thabiso%2C%20saw%20your%20portfolio%20%E2%80%94%20let's%20link%20up",
  },
  {
    label: "IG_HANDLE",
    value: "@MEDUSAISSOHOT",
    type: "link",
    href: "https://instagram.com/medusaissohot",
  },
  {
    label: "PROFESSIONAL",
    value: "LINKEDIN: THABISO KGADIMONYANE",
    type: "link",
    href: "https://linkedin.com/in/thabiso-kgadimonyane",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      id="contact"
      className="relative py-32 px-4 z-10 max-w-5xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-glow-cyan">
          ESTABLISH_LINK
        </h2>
        <p className="text-gray-400 font-mono text-sm tracking-widest">
          &gt; SECURE_COMMUNICATION_CHANNEL
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="border border-gray-800 bg-black/80 backdrop-blur relative overflow-hidden"
      >
        {/* Terminal header */}
        <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-4 bg-gray-900/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-mono text-gray-500">
            contact_terminal.exe — bash — 80x24
          </span>
        </div>

        <div className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-cyan-400 font-mono text-sm mb-2">
              <span className="text-pink-500">➜</span>{" "}
              <span className="text-green-400">~</span> ./initiate_contact.sh
            </p>
            <p className="text-gray-500 font-mono text-xs">
              [SYSTEM] Loading secure channel...{" "}
              <span className="text-green-400">CONNECTED</span>
            </p>
          </motion.div>

          <div className="space-y-4 mb-12">
            {contactData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 border border-gray-900 hover:border-cyan-400/30 bg-gray-900/20 hover:bg-gray-900/40 transition-all duration-300"
              >
                <span className="text-[10px] font-mono text-gray-600 w-32 shrink-0 tracking-wider">
                  {item.label}
                </span>

                {item.href ? (
                  <a
                    href={item.href}
                    target={
                      item.type === "link" || item.type === "whatsapp"
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      item.type === "link" || item.type === "whatsapp"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`font-mono text-sm transition-colors break-all ${
                      item.type === "whatsapp"
                        ? "text-green-400 hover:text-green-300"
                        : "text-cyan-400 hover:text-pink-400"
                    }`}
                  >
                    {item.type === "whatsapp" && (
                      <span className="mr-2">📱</span>
                    )}
                    {item.value}
                  </a>
                ) : (
                  <span className="text-white font-mono text-sm break-all">
                    {item.value}
                  </span>
                )}

                {item.type !== "link" && item.type !== "whatsapp" && (
                  <button
                    onClick={() => handleCopy(item.value, item.label)}
                    className="ml-auto text-[10px] font-mono text-gray-600 hover:text-cyan-400 border border-gray-800 hover:border-cyan-400 px-2 py-1 transition-all"
                  >
                    {copied === item.label ? "COPIED ✓" : "COPY"}
                  </button>
                )}

                {item.type === "whatsapp" && (
                  <span className="ml-auto text-[10px] font-mono text-green-600 border border-green-900 px-2 py-1">
                    FASTEST_REPLY
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <MagneticButton
              variant="cyan"
              href="mailto:thabisokgadimonyane@icloud.com"
            >
              SEND_EMAIL
            </MagneticButton>
            <MagneticButton variant="pink" href="tel:+27781505500">
              INITIATE_CALL
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              href="https://wa.me/27781505500?text=Yo%20Thabiso%2C%20saw%20your%20portfolio%20%E2%80%94%20let's%20link%20up"
            >
              WHATSAPP
            </MagneticButton>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-900">
            <p className="text-[10px] font-mono text-gray-700 text-center">
              END OF TRANSMISSION // ENCRYPTION: AES-256 // JHB_ZA NODE
            </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-cyan-400/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-pink-500/20" />
      </motion.div>
    </section>
  );
}
