import { Link, useLocation } from "react-router-dom";
import { GTLNavLogo } from "./CertificateGenerator";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <GTLNavLogo />
          <div>
            <span className="font-display text-xl text-gold-gradient tracking-[0.15em] uppercase">GTL</span>
            <span className="block text-[9px] tracking-[0.3em] text-muted uppercase font-light">Gem Testing Laboratory · Bareilly</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-gold-gradient transition-colors">
            Verify
          </Link>
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-gold-gradient transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/add" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-gold-gradient transition-colors">
                Add Certificate
              </Link>
              <Link to="/admin/certificates" className="text-xs tracking-[0.2em] uppercase text-muted hover:text-gold-gradient transition-colors">
                Manage
              </Link>
            </>
          ) : (
            <Link to="/admin" className="btn-ghost text-xs px-5 py-2 rounded-sm">
              Admin
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`w-5 h-px bg-gold transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-px bg-gold transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-gold transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gold/10 px-6 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-xs tracking-[0.2em] uppercase text-muted">Verify Certificate</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-xs tracking-[0.2em] uppercase text-muted">Admin Login</Link>
        </div>
      )}
    </nav>
  );
}