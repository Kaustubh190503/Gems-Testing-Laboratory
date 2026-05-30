import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api, resolveFileUrl } from "../api";
import Navbar from "../components/Navbar";
import { DownloadCertButton, GTLNavLogo } from "../components/CertificateGenerator";

const FIELD_MAP = [
  { key: "certificateId",     label: "Certificate Number" },
  { key: "ownerName",         label: "Issued To" },
  { key: "jewelryType",       label: "Jewelry Type" },
  { key: "gemstone",          label: "Gemstone" },
  { key: "weight",            label: "Est. Weight" },
  { key: "color",             label: "Color" },
  { key: "clarity",           label: "Clarity" },
  { key: "cut",               label: "Type of Cut" },
  { key: "origin",            label: "Origin" },
  { key: "opticalClass",      label: "Optical Class" },
  { key: "opticalCharacter",  label: "Optical Character" },
  { key: "refractiveIndex",   label: "Refractive Index" },
  { key: "dimensions",        label: "Dimensions" },
  { key: "description",       label: "Description / Remarks" },
  { key: "conclusion",        label: "Conclusion" },
  { key: "specificComments",  label: "Specific Comments" },
  { key: "issuedBy",          label: "Issuing Laboratory" },
];

export default function Certificate() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [status, setStatus] = useState("loading");
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/certificates/${id}`);
        if (res.data.success) {
          setCert(res.data.certificate);
          setStatus("found");
        } else {
          setStatus("not-found");
        }
      } catch (err) {
        if (err.response?.status === 404) setStatus("not-found");
        else setStatus("error");
      }
    };
    load();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (pdfUrl, filename) => {
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(pdfUrl, "_blank");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-noir flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-[10px] tracking-[0.4em] text-muted uppercase">Verifying Certificate</p>
      </div>
    );
  }

  if (status === "not-found" || status === "error") {
    return (
      <div className="min-h-screen bg-noir flex flex-col items-center justify-center gap-8 px-6">
        <Navbar />
        <div className="text-center max-w-md">
          <div className="font-display text-6xl text-red-400/60 mb-6">✕</div>
          <h2 className="font-display text-3xl text-[#F0EAD6] mb-3">Certificate Not Found</h2>
          <p className="text-xs tracking-[0.15em] text-muted mb-8">
            No record matches <span className="text-gold font-medium">{id}</span>.
            Please check the ID and try again.
          </p>
          <Link to="/" className="btn-ghost px-8 py-3 rounded-sm text-xs inline-block">
            ← Return to Verification
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = resolveFileUrl(cert.image) || cert.imageUrl || null;
  const pdfUrl   = resolveFileUrl(cert.certificateFile) || cert.pdfUrl || null;
  const isActive = cert.status === "active";

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="ornament-divider mb-5">
            <span className="text-[10px] tracking-[0.4em] text-gold/60 uppercase">Certificate of Authenticity</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-[#F0EAD6] font-light mb-4">
            {cert.certificateId}
          </h1>
          <AnimatePresence>
            {isActive ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 verified-badge verified-pulse px-5 py-2 rounded-full text-xs tracking-[0.2em] uppercase mt-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-light" />
                Verified Authentic
              </motion.div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-[0.2em] uppercase mt-2 bg-red-900/20 border border-red-500/30 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                {cert.status?.toUpperCase()}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── MAIN GRID ──────────────────────────────────────────── */}
        <div className="grid md:grid-cols-5 gap-6">

          {/* LEFT: Full details panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="glass-card rounded-sm p-8 h-full">
              <p className="text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-7">Grading Details</p>

              <dl className="space-y-4">
                {FIELD_MAP.map(({ key, label }) => {
                  const value = cert[key];
                  if (value === null || value === undefined || value === "") return null;
                  return (
                    <div key={key} className="flex justify-between items-baseline border-b border-gold/5 pb-4">
                      <dt className="text-[10px] tracking-[0.25em] text-muted uppercase shrink-0 mr-4">{label}</dt>
                      <dd className="text-sm font-medium text-[#F0EAD6] tracking-wide text-right">
                        {key === "weight" ? `${value} ct` : value}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {/* Scan count only */}
              {cert.scanCount > 0 && (
                <div className="mt-6 pt-5 border-t border-gold/8">
                  <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase">
                    <span className="text-muted">Total Verifications</span>
                    <span className="text-gold/70">{cert.scanCount}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Image + QR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="md:col-span-2 flex flex-col gap-4"
          >
            {/* Jewelry image */}
            <div className="glass-card rounded-sm overflow-hidden" style={{ aspectRatio: "1/1" }}>
              {imageUrl && !imgError ? (
                <img
                  src={imageUrl}
                  alt={cert.jewelryType || "Jewelry"}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-dark/50">
                  <span className="font-display text-6xl text-gold/20">◆</span>
                  <span className="text-[9px] tracking-[0.3em] text-muted uppercase">
                    {imgError ? "Image unavailable" : "No image"}
                  </span>
                </div>
              )}
            </div>

            {/* QR Code */}
            {cert.qrCode && (
              <div className="glass-card rounded-sm p-5 text-center">
                <p className="text-[9px] tracking-[0.35em] text-muted uppercase mb-4">Scan to Verify</p>
                <div className="bg-white p-3 rounded-sm inline-block">
                  <img src={cert.qrCode} alt="QR Code" className="w-28 h-28 block" />
                </div>
                <p className="text-[8px] tracking-[0.2em] text-muted/50 uppercase mt-3">
                  gems testing laboratory · bareilly
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── ACTION BUTTONS ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <DownloadCertButton cert={cert} imageUrl={imageUrl} />
          {pdfUrl && (
            <button
              onClick={() => handleDownload(pdfUrl, `${cert.certificateId}-certificate.pdf`)}
              className="btn-ghost flex-1 text-center px-8 py-4 rounded-sm text-xs"
            >
              ↓ Original Uploaded PDF
            </button>
          )}
          <button onClick={handleShare} className="btn-ghost flex-1 px-8 py-4 rounded-sm text-xs">
            {copied ? "✓ Link Copied!" : "Share Verification Link"}
          </button>
          <Link to="/" className="btn-ghost flex-1 text-center px-8 py-4 rounded-sm text-xs">
            ← Verify Another
          </Link>
        </motion.div>

        {/* ── CERTIFICATE CARD PREVIEW ────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-16">
          <div className="ornament-divider mb-8">
            <span className="text-[10px] tracking-[0.4em] text-gold/50 uppercase">Certificate Card Preview</span>
          </div>

          <div className="max-w-md mx-auto">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #111111 0%, #1a1a1a 40%, #141414 100%)",
                border: "1px solid rgba(201,168,76,0.25)",
                aspectRatio: "85.6/53.98",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)",
              }}
            >
              {/* Holographic top strip */}
              <div className="absolute top-0 left-0 right-0 h-0.5 hologram-shimmer"
                style={{ background: "linear-gradient(90deg, transparent, #C9A84C, #E8C96D, #C9A84C, transparent)" }} />

              <div className="absolute inset-0 p-4 flex gap-3">

                {/* LEFT side of card */}
                <div className="flex flex-col justify-between flex-1 min-w-0">

                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 border border-gold/60 rotate-45 flex-shrink-0" />
                    <div>
                      <div className="font-display text-[11px] text-gold-gradient tracking-widest uppercase leading-none">GTL</div>
                      <div className="text-[5px] tracking-[0.2em] text-muted uppercase leading-none mt-0.5">Gems Testing Lab · Bareilly</div>
                    </div>
                  </div>

                  {/* Jewelry photo */}
                  {imageUrl && !imgError && (
                    <div className="w-14 h-11 rounded overflow-hidden border border-gold/20 mb-2">
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* All certificate details on card */}
                  <div className="space-y-0.5 mt-auto">
                    <Row label="Cert No." value={cert.certificateId} />
                    <Row label="Issued To" value={cert.ownerName} />
                    <div className="flex gap-3 flex-wrap">
                      {cert.gemstone    && <MiniRow label="Gemstone" value={cert.gemstone} />}
                      {cert.jewelryType && <MiniRow label="Type"     value={cert.jewelryType} />}
                      {cert.weight      && <MiniRow label="Weight"   value={`${cert.weight} ct`} />}
                      {cert.color       && <MiniRow label="Color"    value={cert.color} />}
                      {cert.clarity     && <MiniRow label="Clarity"  value={cert.clarity} />}
                      {cert.cut         && <MiniRow label="Cut"      value={cert.cut} />}
                      {cert.origin      && <MiniRow label="Origin"   value={cert.origin} />}
                    </div>
                  </div>
                </div>

                {/* RIGHT side: QR */}
                {cert.qrCode && (
                  <div className="flex flex-col items-center justify-between flex-shrink-0 w-16">
                    <div
                      className="text-[4.5px] tracking-[0.15em] text-muted uppercase"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      Scan to Verify
                    </div>
                    <div className="bg-white p-1 rounded-sm">
                      <img src={cert.qrCode} alt="QR" className="w-14 h-14" />
                    </div>
                    <div className="text-[4.5px] tracking-widest text-gold/50 uppercase">Authentic</div>
                  </div>
                )}
              </div>

              {/* Hologram dot */}
              <div
                className="absolute bottom-2 right-2 w-5 h-5 rounded-full border border-gold/30 flex items-center justify-center"
                style={{ background: "conic-gradient(from 0deg, #C9A84C22, #22A06B22, #C9A84C22)" }}
              >
                <span className="font-display text-[6px] text-gold">✦</span>
              </div>
            </div>
            <p className="text-center text-[9px] tracking-[0.3em] text-muted/40 uppercase mt-4">
              Physical Certificate Card Preview
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[5px] tracking-[0.2em] text-gold/50 uppercase">{label}</div>
      <div className="text-[7px] tracking-[0.05em] text-[#F0EAD6] font-medium truncate">{value}</div>
    </div>
  );
}

function MiniRow({ label, value }) {
  return (
    <div>
      <div className="text-[4.5px] tracking-[0.15em] text-gold/40 uppercase">{label}</div>
      <div className="text-[6px] text-[#F0EAD6]">{value}</div>
    </div>
  );
}
