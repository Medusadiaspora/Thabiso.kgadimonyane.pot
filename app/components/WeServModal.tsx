"use client";

import React from "react";
import {
  Server,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  Cpu,
  Terminal,
} from "lucide-react";

export default function WeServDispatchMatrix() {
  return (
    <section className="w-full max-w-4xl mx-auto my-auto p-6 sm:p-8 bg-zinc-950/90 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden font-mono text-white">
      {/* Background Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              PROTOCOL // WE.SERV ENGINE
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>STATUS:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              ACTIVE
            </span>
          </div>
        </div>

        {/* Project Title & Overview */}
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              WE.SERV DISPATCH MATRIX
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
            Multi-tenant service dispatch engine built with Next.js, TypeScript,
            AWS Cognito, AWS S3 storage, and integrated Yoco payment gateway
            webhooks.
          </p>
        </div>

        {/* Spec Grid Cards with Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-4 bg-black/80 border border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.08)] group">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">
                // INFRASTRUCTURE
              </span>
              <Server className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-2">AWS S3 Core</div>
            <div className="text-[10px] text-zinc-400 mt-1 leading-normal">
              Serverless dispatching & asset storage.
            </div>
          </div>

          <div className="p-4 bg-black/80 border border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.08)] group">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">
                // SECURITY & DATA
              </span>
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-2">
              AWS Cognito & DynamoDB
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 leading-normal">
              Multi-tenant user identity & NoSQL state.
            </div>
          </div>

          <div className="p-4 bg-black/80 border border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.08)] group">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">
                // PAYMENTS
              </span>
              <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-2">
              Yoco Webhooks
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 leading-normal">
              Automated checkout & service dispatch.
            </div>
          </div>
        </div>

        {/* GitHub Repository Action Link */}
        <div className="pt-2">
          <a
            href="https://github.com/Medusadiaspora/We.Serv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <span>OPEN GITHUB REPOSITORY</span>
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Establish Link Section Title Header */}
        <div className="pt-4 border-t border-zinc-900 text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            ESTABLISH_LINK
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-widest">
            &gt; SECURE_COMMUNICATION_CHANNEL &lt;
          </p>
        </div>
      </div>
    </section>
  );
}
