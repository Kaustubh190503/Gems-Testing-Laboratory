import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // NOTE: In production, replace this with a real JWT API call to your backend
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate network

    // FIX: credentials should come from backend JWT — this is placeholder only
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("ngw_admin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gold/5 rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-gold/5 rotate-45" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-10 h-10 relative">
              <div className="w-10 h-10 border border-gold/60 rotate-45" />
              <div className="absolute inset-1.5 bg-gold/15 rotate-45" />
            </div>
            <span className="font-display text-xl text-gold-gradient tracking-[0.2em] uppercase">NGW</span>
            <span className="text-[9px] tracking-[0.35em] text-muted uppercase">Gems Testing Laboratory · Bareilly</span>
          </Link>
        </div>

        <div className="glass-card rounded-sm p-8 relative">
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-gold/30" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-gold/30" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-gold/30" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-gold/30" />

          <h2 className="text-[11px] tracking-[0.35em] text-muted uppercase text-center mb-8">
            Secure Access
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] text-muted/70 uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="luxury-input w-full px-5 py-3.5 rounded-sm text-xs tracking-widest"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-[9px] tracking-[0.3em] text-muted/70 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="luxury-input w-full px-5 py-3.5 rounded-sm text-xs tracking-widest"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[10px] tracking-[0.15em] text-red-400 text-center py-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-sm text-xs mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-3 h-3 border border-noir/50 border-t-noir rounded-full animate-spin" />
                  Authenticating
                </span>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-[9px] tracking-[0.3em] text-muted/50 uppercase hover:text-gold/60 transition-colors">
            ← Customer Verification
          </Link>
        </div>
      </motion.div>
    </div>
  );
}