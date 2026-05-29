import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const STATS = [
  { value: "5000+", label: "Certificates Issued" },
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "15+", label: "Years of Expertise" },
  { value: "100%", label: "Tamper-Proof" },
];

const FEATURES = [
  {
    icon: "◈",
    title: "QR Verification",
    desc: "Scan the QR code on your physical certificate card for instant verification of your gemstone's authenticity.",
  },
  {
    icon: "◆",
    title: "Tamper-Proof Records",
    desc: "Each certificate is secured with a unique digital fingerprint, making duplication or forgery impossible.",
  },
  {
    icon: "✦",
    title: "Expert Grading",
    desc: "Every gemstone is graded by certified gemologists at GEMS TESTING LABORATORY, Bareilly following international standards.",
  },
];

export default function Home() {
  const [certificateId, setCertificateId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!certificateId.trim()) return;
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 600));
    navigate(`/certificate/${certificateId.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-noir overflow-hidden">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large rotated diamond outline */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rotate-45" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/5 rotate-45" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-gold/8 rotate-45" />
          {/* Radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald/5 rounded-full blur-3xl" />
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 bg-gold/30 rotate-45"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                "--duration": `${6 + i * 1.5}s`,
                "--delay": `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="ornament-divider mb-8"
          >
            <span className="text-[10px] tracking-[0.4em] text-gold/70 uppercase">
              GEMS TESTING LABORATORY · BAREILLY
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-6"
          >
            <span className="text-[#F0EAD6]">Gemstone</span>{" "}
            <span className="text-gold-gradient font-semibold italic">Certification</span>
            <br />
            <span className="text-[#F0EAD6]">&amp; Verification</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm tracking-[0.2em] text-muted uppercase mb-14 max-w-xl mx-auto"
          >
            Scan your QR code or enter a certificate ID below to verify
            the authenticity of your NGW-certified gemstone or jewelry
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                placeholder="ENTER CERTIFICATE ID — e.g. GEM-2026-001"
                className="luxury-input w-full px-6 py-4 rounded-sm text-xs tracking-widest"
              />
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/40" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/40" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/40" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/40" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="btn-gold px-8 py-4 rounded-sm text-xs min-w-[120px]"
            >
              {isSearching ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-3 h-3 border border-noir/50 border-t-noir rounded-full animate-spin" />
                  Verifying
                </span>
              ) : (
                "Verify"
              )}
            </button>
          </motion.form>

          {/* CTA secondary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            <a
              href="/admin"
              className="text-[10px] tracking-[0.3em] text-muted/60 uppercase hover:text-gold/70 transition-colors"
            >
              Admin Login →
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.4em] text-muted/40 uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/30 to-transparent" />
        </motion.div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 border-y border-gold/8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl text-gold-gradient font-semibold mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.25em] text-muted uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-4">Process</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#F0EAD6] font-light">
              How <span className="text-gold-gradient italic">Verification</span> Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-sm p-8 group hover:border-gold/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="hologram-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="font-display text-4xl text-gold/40 mb-6 group-hover:text-gold/70 transition-colors">
                    {feat.icon}
                  </div>
                  <h3 className="text-sm tracking-[0.2em] uppercase text-[#F0EAD6] mb-3 font-medium">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed tracking-wide">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-gold/8 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-lg text-gold/60 tracking-widest uppercase">
            GEMS TESTING LABORATORY · BAREILLY
          </div>
          <p className="text-[10px] tracking-[0.25em] text-muted/50 uppercase">
            © {new Date().getFullYear()} All Rights Reserved · Certificates are legally binding documents
          </p>
        </div>
      </footer>
    </div>
  );
}