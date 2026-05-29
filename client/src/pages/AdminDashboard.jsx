import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: changed localStorage key from "admin" to "ngw_admin"
    if (!localStorage.getItem("ngw_admin")) {
      navigate("/admin");
      return;
    }
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/certificates/analytics");
      if (res.data.success) setAnalytics(res.data.analytics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ngw_admin");
    navigate("/admin");
  };

  const CARDS = [
    {
      title: "Add Certificate",
      desc: "Issue a new gemstone or jewelry certificate with full grading details.",
      icon: "✦",
      action: "/admin/add",
      accent: "gold",
    },
    {
      title: "Manage Certificates",
      desc: "Search, view, and delete certificate records.",
      icon: "◈",
      action: "/admin/certificates",
      accent: "emerald",
    },
    {
      title: "QR Verification",
      desc: "Each certificate auto-generates a scannable QR linking to its verification page.",
      icon: "◇",
      action: null,
      accent: "muted",
    },
  ];

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-14">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-2">Control Panel</p>
            <h1 className="font-display text-4xl md:text-5xl text-[#F0EAD6] font-light">
              Admin <span className="text-gold-gradient italic">Dashboard</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost self-start px-5 py-2.5 rounded-sm text-xs"
          >
            Sign Out
          </button>
        </div>

        {/* Analytics row */}
        {!loading && analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
          >
            {[
              { label: "Total Certificates", value: analytics.total },
              { label: "Active Certificates", value: analytics.active },
              { label: "Total QR Scans", value: analytics.totalScans },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-sm p-6">
                <div className="font-display text-3xl text-gold-gradient mb-1">{stat.value}</div>
                <div className="text-[9px] tracking-[0.25em] text-muted uppercase">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Action cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {card.action ? (
                <Link to={card.action} className="block h-full">
                  <DashboardCard {...card} />
                </Link>
              ) : (
                <DashboardCard {...card} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Recent certificates */}
        {analytics?.recent?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="ornament-divider mb-6">
              <span className="text-[10px] tracking-[0.4em] text-gold/50 uppercase">Recent Activity</span>
            </div>

            <div className="glass-card rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10">
                    {["Certificate ID", "Owner", "Type", "Scans", "Created"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-[9px] tracking-[0.3em] text-muted uppercase font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analytics.recent.map((cert, i) => (
                    <tr
                      key={cert._id}
                      className="border-b border-gold/5 hover:bg-gold/3 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/certificate/${cert.certificateId}`}
                          className="text-xs text-gold/80 hover:text-gold tracking-wider"
                        >
                          {cert.certificateId}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#F0EAD6]/80">{cert.ownerName}</td>
                      <td className="px-5 py-4 text-xs text-muted">{cert.jewelryType}</td>
                      <td className="px-5 py-4 text-xs text-muted">{cert.scanCount || 0}</td>
                      <td className="px-5 py-4 text-[10px] text-muted">
                        {new Date(cert.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4">
              <Link to="/admin/certificates" className="text-[10px] tracking-[0.3em] text-gold/50 uppercase hover:text-gold/80 transition-colors">
                View All Certificates →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, desc, icon, accent }) {
  const borderClass =
    accent === "gold"
      ? "border-gold/20 hover:border-gold/40"
      : accent === "emerald"
      ? "border-emerald/20 hover:border-emerald/40"
      : "border-dark-border hover:border-dark-border";

  return (
    <div
      className={`glass-card ${borderClass} rounded-sm p-7 h-full group hover:bg-gold/2 transition-all duration-400 cursor-pointer`}
    >
      <div
        className={`font-display text-3xl mb-5 transition-colors ${
          accent === "gold"
            ? "text-gold/40 group-hover:text-gold/70"
            : accent === "emerald"
            ? "text-emerald/40 group-hover:text-emerald/70"
            : "text-muted/40 group-hover:text-muted/60"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-xs tracking-[0.25em] uppercase text-[#F0EAD6] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-[11px] text-muted leading-relaxed tracking-wide">{desc}</p>
    </div>
  );
}