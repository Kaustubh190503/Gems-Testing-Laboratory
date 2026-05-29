import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api, resolveFileUrl } from "../api";
import { DownloadCertButton } from "../components/CertificateGenerator";
import Navbar from "../components/Navbar";

export default function ViewCertificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("ngw_admin")) navigate("/admin");
  }, [navigate]);

  const fetchCertificates = useCallback(async (q = "") => {
    setLoading(true);
    try {
      // FIX: use centralised api helper with optional search query
      const res = await api.get("/certificates", {
        params: q ? { search: q } : {},
      });
      setCertificates(res.data.certificates || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchCertificates(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchCertificates]);

  const handleDelete = async (cert) => {
    if (!confirm(`Delete certificate ${cert.certificateId}? This cannot be undone.`)) return;
    setDeleting(cert._id);
    try {
      // FIX: deletes by _id now (controller uses findByIdAndDelete)
      await api.delete(`/certificates/${cert._id}`);
      fetchCertificates(search);
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const statusColor = (s) =>
    s === "active" ? "text-emerald-light border-emerald/30" : "text-red-400 border-red-500/30";

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Link to="/admin/dashboard" className="text-[9px] tracking-[0.3em] text-muted/50 uppercase hover:text-gold/60 transition-colors">
              ← Dashboard
            </Link>
            <p className="text-[10px] tracking-[0.4em] text-gold/60 uppercase mt-4 mb-2">Administration</p>
            <h1 className="font-display text-4xl text-[#F0EAD6] font-light">
              Certificate <span className="text-gold-gradient italic">Records</span>
            </h1>
          </div>
          <Link to="/admin/add" className="btn-gold self-start px-7 py-3 rounded-sm text-xs">
            + Issue New
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY ID, NAME, OR TYPE"
            className="luxury-input w-full px-5 py-3.5 rounded-sm text-xs tracking-widest pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-gold text-sm"
            >
              ×
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] tracking-[0.3em] text-muted uppercase">Loading Records</p>
          </div>
        )}

        {/* Empty */}
        {!loading && certificates.length === 0 && (
          <div className="text-center py-20">
            <div className="font-display text-5xl text-gold/15 mb-4">◆</div>
            <p className="text-xs tracking-[0.2em] text-muted uppercase">
              {search ? "No certificates match your search" : "No certificates issued yet"}
            </p>
            {!search && (
              <Link to="/admin/add" className="btn-gold inline-block mt-6 px-8 py-3 rounded-sm text-xs">
                Issue First Certificate
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && certificates.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert, i) => {
              const imgUrl = resolveFileUrl(cert.image);
              return (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-sm overflow-hidden group"
                >
                  {/* Image */}
                  <div className="h-44 bg-dark overflow-hidden">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={cert.jewelryType}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.parentElement.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center"><span class="font-display text-5xl text-gold/15">◆</span></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-5xl text-gold/15">◆</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5 text-[8px] tracking-[0.2em] uppercase border rounded-full px-3 py-1 mb-4 ${statusColor(cert.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {cert.status || "active"}
                    </div>

                    <p className="text-[9px] tracking-[0.3em] text-gold/60 uppercase mb-1">
                      {cert.certificateId}
                    </p>
                    <h3 className="text-sm text-[#F0EAD6] font-medium mb-1 truncate">
                      {cert.ownerName}
                    </h3>
                    <p className="text-[10px] text-muted mb-4">
                      {cert.gemstone} · {cert.jewelryType}
                      {cert.weight && ` · ${cert.weight} ct`}
                    </p>

                    {/* Scan count */}
                    {cert.scanCount > 0 && (
                      <p className="text-[9px] text-muted/50 tracking-wide mb-4">
                        {cert.scanCount} verification{cert.scanCount !== 1 ? "s" : ""}
                      </p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <DownloadCertButton
                        cert={cert}
                        imageUrl={resolveFileUrl(cert.image)}
                        compact
                      />
                      <Link
                        to={`/certificate/${cert.certificateId}`}
                        className="btn-ghost flex-1 text-center py-2 rounded-sm text-[10px]"
                      >
                        View
                      </Link>
                      {cert.certificateFile && (
                        <a
                          href={resolveFileUrl(cert.certificateFile)}
                          className="flex-1 text-center py-2 rounded-sm text-[10px] tracking-[0.1em] uppercase border border-gold/20 text-gold/70 hover:bg-gold/10 transition-colors"
                          onClick={async (e) => {
                            e.preventDefault();
                            const url = resolveFileUrl(cert.certificateFile);
                            try {
                              const res = await fetch(url);
                              if (!res.ok) throw new Error();
                              const blob = await res.blob();
                              const burl = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = burl;
                              a.download = cert.certificateId + "-certificate.pdf";
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              URL.revokeObjectURL(burl);
                            } catch {
                              window.open(url, "_blank");
                            }
                          }}
                        >
                          ↓ PDF
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(cert)}
                        disabled={deleting === cert._id}
                        className="px-3 py-2 rounded-sm text-[10px] tracking-[0.1em] uppercase border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        {deleting === cert._id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}