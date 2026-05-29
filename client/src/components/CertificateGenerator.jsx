import { useRef, useState, useEffect } from "react";

const GTL = {
  name:           "GEM TESTING LABORATORY",
  address:        "46, Civil Lines, Hotel Oberai Anand Complex, Bareilly (U.P.)-243001",
  phone:          "Ph: (9412193950)",
  owner:          "CHANDAN ARORA",
  designation:    "GEMMOLOGIST",
  qualifications: "DIAMOND GRADER, DGI, MDGI",
};

const BACK_NOTES = [
  "This report describes the properties of the given specimen on the said Date & Time.",
  "Limitations of the Mounted Jewellery applicable.",
];
const DIAMOND_INFO = [
  "Diamond is the Hardest Gemstone ranging from Transparent to Opaque varieties & is found in all colors.",
  "Diamond is also synthesized in Laboratory by Flux Fusion & CVD techniques.",
  "Diamond may also be enhanced / treated by following techniques:",
];
const TREATMENTS   = ["Fracture Filling", "Coating", "HPHT", "Irradiation"];
const GRADING_INFO = [
  "Diamond grading is on the basis of Color, Clarity, Cut & Carat size.",
  "Ranging from IF (internal flawless), VVS, VS, SI, S, P.",
  "Color starting from D, E, F, G (Rare), H, I, J, K to S-X or Dark Cape.",
];
const DISCLAIMER =
  "GTL, Bareilly nor any of its employees shall be responsible for any action that may be taken on the basis of this report.";

async function toBase64(url) {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise(resolve => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

function buildRows(cert) {
  const gem = cert.gemstone || "Diamond";
  const wt  = cert.weight
    ? cert.weight.toString().toLowerCase().includes("ct") ? cert.weight : `${cert.weight} ct`
    : null;

  const candidates = [
    { label: `${gem} Est. Wt.`,     value: wt,                     always: true },
    { label: "Color",               value: cert.color },
    { label: "Clarity",             value: cert.clarity },
    { label: "Type of Cut",         value: cert.cut },
    { label: "Origin",              value: cert.origin },
    { label: "Optical Class",       value: cert.opticalClass },
    { label: "Optical Character",   value: cert.opticalCharacter },
    { label: "Refractive Index",    value: cert.refractiveIndex },
    { label: "Dimensions",          value: cert.dimensions },
    { label: "Description",         value: cert.description,        multiline: true },
  ];

  return candidates.filter(r => r.always || (r.value && r.value.trim() !== ""));
}

// ─── GTL Logo SVG (matches actual logo: square border + diamond facets + GTL text) ──
function GTLLogo({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      {/* Outer square border */}
      <rect x="3" y="3" width="94" height="94" fill="white" stroke="#1a1a1a" strokeWidth="2.5"/>
      {/* Inner square border (thin) */}
      <rect x="7" y="7" width="86" height="86" fill="none" stroke="#1a1a1a" strokeWidth="1"/>

      {/* Diamond gem shape — top facet (table) */}
      <polygon points="35,28 65,28 72,42 50,75 28,42" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
      {/* Top-left facet */}
      <line x1="35" y1="28" x2="28" y2="42" stroke="#1a1a1a" strokeWidth="1"/>
      {/* Top-right facet */}
      <line x1="65" y1="28" x2="72" y2="42" stroke="#1a1a1a" strokeWidth="1"/>
      {/* Table (flat top of gem) */}
      <line x1="35" y1="28" x2="65" y2="28" stroke="#1a1a1a" strokeWidth="1.5"/>
      {/* Girdle line */}
      <line x1="28" y1="42" x2="72" y2="42" stroke="#1a1a1a" strokeWidth="1.2"/>
      {/* Left pavilion facets */}
      <line x1="28" y1="42" x2="50" y2="75" stroke="#1a1a1a" strokeWidth="1"/>
      {/* Right pavilion facets */}
      <line x1="72" y1="42" x2="50" y2="75" stroke="#1a1a1a" strokeWidth="1"/>
      {/* Center vertical keel */}
      <line x1="50" y1="28" x2="50" y2="75" stroke="#1a1a1a" strokeWidth="0.8"/>
      {/* Upper inner facet lines */}
      <line x1="42" y1="42" x2="50" y2="28" stroke="#1a1a1a" strokeWidth="0.8"/>
      <line x1="58" y1="42" x2="50" y2="28" stroke="#1a1a1a" strokeWidth="0.8"/>
      {/* Lower inner facet lines */}
      <line x1="42" y1="42" x2="50" y2="75" stroke="#1a1a1a" strokeWidth="0.7"/>
      <line x1="58" y1="42" x2="50" y2="75" stroke="#1a1a1a" strokeWidth="0.7"/>

      {/* GTL text below diamond */}
      <text x="50" y="91" textAnchor="middle" fontSize="9" fontWeight="bold"
        fontFamily="'Times New Roman', Georgia, serif" fill="#1a1a1a" letterSpacing="2">GTL</text>
    </svg>
  );
}

// ─── Corner ornament ──────────────────────────────────────────────────────────
function CornerOrnament({ position }) {
  const transforms = {
    tl: "rotate(0)",
    tr: "rotate(90) translate(0,-24)",
    br: "rotate(180) translate(-24,-24)",
    bl: "rotate(270) translate(-24,0)",
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24"
      style={{ position: "absolute",
        top: position.includes("t") ? 10 : "auto",
        bottom: position.includes("b") ? 10 : "auto",
        left: position.includes("l") ? 10 : "auto",
        right: position.includes("r") ? 10 : "auto",
      }}>
      <g transform={transforms[position]}>
        <path d="M2,2 L14,2 L14,4 L4,4 L4,14 L2,14 Z" fill="#8B0000" opacity="0.7"/>
        <circle cx="2" cy="2" r="1.5" fill="#8B0000"/>
      </g>
    </svg>
  );
}

// ─── Watermark diamond ────────────────────────────────────────────────────────
function WatermarkDiamond() {
  return (
    <svg width="320" height="320" viewBox="0 0 120 120"
      style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", opacity: 0.035, pointerEvents: "none" }}>
      <polygon points="60,4 116,60 60,116 4,60" fill="none" stroke="#8B0000" strokeWidth="4"/>
      <polygon points="60,18 102,60 60,102 18,60" fill="none" stroke="#8B0000" strokeWidth="3"/>
      <polygon points="60,26 78,46 60,72 42,46" fill="none" stroke="#8B0000" strokeWidth="2"/>
      <line x1="42" y1="46" x2="78" y2="46" stroke="#8B0000" strokeWidth="2"/>
    </svg>
  );
}

// ─── FRONT PAGE ───────────────────────────────────────────────────────────────
export function CertFront({ cert, imageBase64, pageRef }) {
  const gem  = cert.gemstone || "Diamond";
  const rows = buildRows(cert);
  const borderColor = "#8B0000";
  const goldAccent  = "#C9A84C";

  return (
    <div ref={pageRef} style={{
      width: "794px", minHeight: "595px",
      background: "#ffffff",
      fontFamily: "'Times New Roman', Georgia, serif",
      fontSize: "13px", color: "#1a1a1a",
      padding: "0",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Outer double border */}
      <div style={{
        position: "absolute", inset: "6px",
        border: `3px double ${borderColor}`,
        pointerEvents: "none", zIndex: 2,
      }}/>
      {/* Inner thin border */}
      <div style={{
        position: "absolute", inset: "12px",
        border: `1px solid ${borderColor}`,
        opacity: 0.35,
        pointerEvents: "none", zIndex: 2,
      }}/>

      {/* Corner ornaments */}
      <CornerOrnament position="tl"/>
      <CornerOrnament position="tr"/>
      <CornerOrnament position="bl"/>
      <CornerOrnament position="br"/>

      {/* Watermark */}
      <WatermarkDiamond/>

      {/* Top gold accent bar */}
      <div style={{
        background: `linear-gradient(90deg, transparent, ${borderColor}, ${goldAccent}, ${borderColor}, transparent)`,
        height: "3px", width: "100%",
      }}/>

      <div style={{ padding: "16px 32px 20px" }}>

        {/* ── HEADER ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-start",
          gap: "20px", marginBottom: "0",
        }}>
          <GTLLogo size={80}/>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              fontSize: "24px", fontWeight: "bold", letterSpacing: "5px",
              color: "#1a1a1a", fontFamily: "'Times New Roman', Georgia, serif",
              textTransform: "uppercase",
            }}>
              {GTL.name}
            </div>
            <div style={{
              width: "100%", height: "1px",
              background: `linear-gradient(90deg, transparent, ${goldAccent}, transparent)`,
              margin: "5px 0",
            }}/>
            <div style={{ fontSize: "10.5px", color: "#444", letterSpacing: "0.8px", fontFamily: "'Times New Roman', Georgia, serif" }}>{GTL.address}</div>
            <div style={{ fontSize: "10.5px", color: "#444", fontFamily: "'Times New Roman', Georgia, serif" }}>{GTL.phone}</div>
          </div>
        </div>

        {/* Red separator with diamonds */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          margin: "10px 0 8px",
        }}>
          <div style={{ flex: 1, height: "1.5px", background: borderColor }}/>
          <span style={{ color: goldAccent, fontSize: "14px" }}>◆</span>
          <span style={{ color: borderColor, fontSize: "10px" }}>✦</span>
          <span style={{ color: goldAccent, fontSize: "14px" }}>◆</span>
          <div style={{ flex: 1, height: "1.5px", background: borderColor }}/>
        </div>

        {/* ── CERTIFICATE TITLE ── */}
        <div style={{
          textAlign: "center", marginBottom: "10px",
          background: `linear-gradient(135deg, #fafafa 0%, #f5f0e8 50%, #fafafa 100%)`,
          border: `1px solid ${borderColor}`,
          padding: "7px 20px",
          position: "relative",
        }}>
          <div style={{
            fontSize: "15px", fontWeight: "bold", color: borderColor,
            letterSpacing: "3px", textTransform: "uppercase",
            fontFamily: "'Times New Roman', Georgia, serif",
          }}>
            ◈ &nbsp;{cert.certificateTitle || `${gem} Jewellery Identification Certificate`}&nbsp; ◈
          </div>
        </div>

        {/* IC Number + Name row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          background: "#f9f6f0", borderLeft: `3px solid ${borderColor}`,
          padding: "6px 12px", marginBottom: "10px", fontSize: "12.5px",
        }}>
          <div>
            <span style={{ color: "#666", fontStyle: "italic" }}>IC: </span>
            <strong style={{ color: "#1a1a1a", letterSpacing: "1px" }}>{cert.certificateId}</strong>
          </div>
          <div>
            <span style={{ color: "#666", fontStyle: "italic" }}>Name: </span>
            <strong style={{ color: "#1a1a1a" }}>{cert.ownerName}</strong>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ color: "#666", fontStyle: "italic" }}>Date: </span>
            <span style={{ color: "#1a1a1a" }}>
              {new Date(cert.createdAt || Date.now()).toLocaleDateString("en-IN",
                { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* ── NATURAL STAMP ── */}
        <div style={{ textAlign: "center", margin: "4px 0 10px" }}>
          <span style={{
            display: "inline-block",
            border: `2px solid #1a6fb5`,
            color: "#1a6fb5",
            fontStyle: "italic", fontWeight: "bold", fontSize: "15px",
            padding: "2px 20px",
            letterSpacing: "1px",
          }}>
            ❝ Natural {gem} ❞
          </span>
        </div>

        {/* ── BODY ── */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>

          {/* Results table */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "11px", fontStyle: "italic", color: "#555",
              marginBottom: "6px", letterSpacing: "0.3px",
            }}>
              The examination results are as follows:
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={r.label} style={{
                    background: idx % 2 === 0 ? "#fafaf8" : "#f4f0e8",
                  }}>
                    <td style={{
                      fontWeight: "bold", paddingRight: "12px",
                      paddingTop: "5px", paddingBottom: "5px",
                      paddingLeft: "8px",
                      whiteSpace: "nowrap", verticalAlign: "top",
                      width: "155px", color: borderColor,
                      borderLeft: `2px solid ${borderColor}`,
                      fontSize: "12px", fontFamily: "'Times New Roman', Georgia, serif",
                      letterSpacing: "0.5px",
                    }}>
                      {r.label}
                    </td>
                    <td style={{
                      paddingTop: "5px", paddingBottom: "5px",
                      paddingLeft: "8px",
                      lineHeight: r.multiline ? "1.55" : "1.3",
                      verticalAlign: "top",
                      borderBottom: "1px solid #e8e0d0",
                    }}>
                      {r.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Conclusion */}
            <div style={{
              marginTop: "10px",
              background: `linear-gradient(90deg, ${borderColor}15, transparent)`,
              borderLeft: `3px solid ${borderColor}`,
              padding: "6px 12px",
              display: "flex", gap: "10px", alignItems: "baseline",
            }}>
              <span style={{ fontWeight: "bold", fontSize: "12px", color: borderColor, whiteSpace: "nowrap" }}>
                Conclusion:
              </span>
              <span style={{ fontWeight: "bold", fontSize: "13px", color: "#1a1a1a" }}>
                {cert.conclusion || "Result Confirm Natural Origin"}
              </span>
            </div>

            {cert.specificComments && cert.specificComments.trim() && (
              <div style={{
                marginTop: "6px", fontSize: "11.5px",
                color: "#333", lineHeight: "1.5",
                borderLeft: `2px solid ${goldAccent}`,
                paddingLeft: "8px",
              }}>
                <strong>Specific Comments:</strong> {cert.specificComments}
              </div>
            )}
          </div>

          {/* Image + QR */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "10px", flexShrink: 0, width: "132px",
          }}>
            <div style={{
              width: "128px", height: "100px",
              border: `2px solid ${borderColor}`,
              overflow: "hidden", background: "#f5f5f5",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              {imageBase64
                ? <img src={imageBase64} alt="jewelry"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#aaa", fontSize: "10px", textAlign: "center", padding: "4px" }}>No Image</span>
              }
              {/* Image frame corners */}
              <div style={{ position:"absolute", top:2, left:2, width:8, height:8,
                borderTop:`2px solid ${goldAccent}`, borderLeft:`2px solid ${goldAccent}` }}/>
              <div style={{ position:"absolute", top:2, right:2, width:8, height:8,
                borderTop:`2px solid ${goldAccent}`, borderRight:`2px solid ${goldAccent}` }}/>
              <div style={{ position:"absolute", bottom:2, left:2, width:8, height:8,
                borderBottom:`2px solid ${goldAccent}`, borderLeft:`2px solid ${goldAccent}` }}/>
              <div style={{ position:"absolute", bottom:2, right:2, width:8, height:8,
                borderBottom:`2px solid ${goldAccent}`, borderRight:`2px solid ${goldAccent}` }}/>
            </div>
            {cert.qrCode && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "8px", color: "#888", letterSpacing: "1px",
                  marginBottom: "3px", textTransform: "uppercase" }}>Scan to Verify</div>
                <div style={{ border: `1px solid ${borderColor}`, padding: "3px", display: "inline-block" }}>
                  <img src={cert.qrCode} alt="QR"
                    style={{ width: "96px", height: "96px", display: "block" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop: "12px",
          borderTop: `1px solid ${goldAccent}`,
          paddingTop: "8px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          {/* Lab stamp / seal area */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              border: `2px solid ${borderColor}`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              fontSize: "6px", color: borderColor,
              letterSpacing: "0.5px", textTransform: "uppercase",
              background: `radial-gradient(circle, #fff9f0, #fff)`,
            }}>
              <span style={{ fontSize: "9px", fontWeight: "bold" }}>GTL</span>
              <span>BAREILLY</span>
              <span>OFFICIAL</span>
            </div>
            <div style={{ fontSize: "10px", color: "#666", fontStyle: "italic" }}>
              <div>Authenticated by</div>
              <div style={{ fontWeight: "bold", color: "#1a1a1a", fontSize: "11px" }}>
                {GTL.name}
              </div>
            </div>
          </div>

          {/* Owner signature block */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              width: "140px", borderBottom: `1px solid #aaa`,
              marginBottom: "4px", height: "22px",
            }}/>
            <div style={{ fontWeight: "bold", fontSize: "13px", color: "#1a1a1a", fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "0.5px" }}>{GTL.owner}</div>
            <div style={{ fontSize: "11px", color: "#444", fontFamily: "'Times New Roman', Georgia, serif" }}>{GTL.designation}</div>
            <div style={{ fontSize: "10.5px", color: "#666", fontFamily: "'Times New Roman', Georgia, serif" }}>{GTL.qualifications}</div>
            <div style={{
              fontStyle: "italic", fontSize: "10.5px",
              color: borderColor, marginTop: "1px", fontFamily: "'Times New Roman', Georgia, serif",
            }}>Authorised Signatory</div>
          </div>
        </div>

      </div>

      {/* Bottom gold accent bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: `linear-gradient(90deg, transparent, ${borderColor}, ${goldAccent}, ${borderColor}, transparent)`,
        height: "3px",
      }}/>
    </div>
  );
}

// ─── BACK PAGE ────────────────────────────────────────────────────────────────
export function CertBack({ backRef }) {
  const borderColor = "#8B0000";
  const goldAccent  = "#C9A84C";

  return (
    <div ref={backRef} style={{
      width: "794px", minHeight: "595px",
      background: "#ffffff",
      fontFamily: "'Times New Roman', Georgia, serif",
      fontSize: "13px", color: "#1a1a1a",
      padding: "0",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Borders */}
      <div style={{ position:"absolute", inset:"6px", border:`3px double ${borderColor}`, pointerEvents:"none", zIndex:2 }}/>
      <div style={{ position:"absolute", inset:"12px", border:`1px solid ${borderColor}`, opacity:0.35, pointerEvents:"none", zIndex:2 }}/>
      <CornerOrnament position="tl"/>
      <CornerOrnament position="tr"/>
      <CornerOrnament position="bl"/>
      <CornerOrnament position="br"/>
      <WatermarkDiamond/>

      <div style={{ background:`linear-gradient(90deg, transparent, ${borderColor}, ${goldAccent}, ${borderColor}, transparent)`, height:"3px" }}/>

      <div style={{ padding:"20px 36px 20px" }}>

        <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"14px" }}>
          <GTLLogo size={48}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight:"bold", fontSize:"16px", letterSpacing:"3px", fontFamily:"'Times New Roman', Georgia, serif", textTransform:"uppercase", color:"#1a1a1a" }}>{GTL.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", margin:"6px 0" }}>
              <div style={{ flex:1, height:"1px", background:borderColor }}/>
              <span style={{ color:goldAccent }}>◆</span>
              <div style={{ flex:1, height:"1px", background:borderColor }}/>
            </div>
          </div>
        </div>

        {/* NOTE section */}
        <div style={{
          background:"#f9f6f0", border:`1px solid ${borderColor}`,
          borderLeft:`4px solid ${borderColor}`,
          padding:"10px 16px", marginBottom:"14px",
        }}>
          <div style={{ fontWeight:"bold", fontSize:"12px", color:borderColor,
            letterSpacing:"2px", marginBottom:"7px", textTransform:"uppercase" }}>Note</div>
          {BACK_NOTES.map((n, i) => (
            <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"5px",
              lineHeight:"1.6", fontSize:"12px" }}>
              <span style={{ color:borderColor, flexShrink:0 }}>◆</span><span>{n}</span>
            </div>
          ))}
        </div>

        {/* Diamond info */}
        <div style={{
          background:"#f4f0e8", border:`1px solid ${goldAccent}`,
          padding:"10px 16px", marginBottom:"12px",
        }}>
          <div style={{ fontWeight:"bold", fontSize:"12px", color:"#7a5c00",
            letterSpacing:"2px", marginBottom:"8px", textTransform:"uppercase" }}>
            General Information on Diamonds
          </div>
          {DIAMOND_INFO.map((item, i) => (
            <div key={i} style={{ marginBottom: i === 2 ? "3px" : "6px" }}>
              <div style={{ display:"flex", gap:"8px", lineHeight:"1.6", fontSize:"12px" }}>
                <span style={{ color:goldAccent, flexShrink:0 }}>◈</span><span>{item}</span>
              </div>
              {i === 2 && (
                <div style={{ paddingLeft:"24px", marginTop:"3px" }}>
                  {TREATMENTS.map(t => (
                    <div key={t} style={{ display:"flex", gap:"6px", marginBottom:"2px", fontSize:"11.5px" }}>
                      <span style={{ color:"#999" }}>–</span><span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Grading info */}
        <div style={{ marginBottom:"10px" }}>
          {GRADING_INFO.map((item, i) => (
            <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"5px",
              lineHeight:"1.6", fontSize:"12px" }}>
              <span style={{ color:borderColor, flexShrink:0 }}>◆</span><span>{item}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          borderTop:`1px solid ${goldAccent}`, paddingTop:"10px",
          fontSize:"11px", color:"#555", lineHeight:"1.6",
          fontStyle:"italic",
        }}>
          {DISCLAIMER}
        </div>

      </div>

      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        background:`linear-gradient(90deg, transparent, ${borderColor}, ${goldAccent}, ${borderColor}, transparent)`,
        height:"3px",
      }}/>
    </div>
  );
}

// ─── DOWNLOAD BUTTON ──────────────────────────────────────────────────────────
export function DownloadCertButton({ cert, imageUrl, compact = false }) {
  const [loading, setLoading]         = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const frontRef = useRef(null);
  const backRef  = useRef(null);

  useEffect(() => {
    if (imageUrl) toBase64(imageUrl).then(setImageBase64);
  }, [imageUrl]);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [794, 595] });

      const frontCanvas = await html2canvas(frontRef.current, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: "#ffffff", logging: false, imageTimeout: 0,
      });
      pdf.addImage(frontCanvas.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, 794, 595);

      pdf.addPage([794, 595], "landscape");
      const backCanvas = await html2canvas(backRef.current, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false,
      });
      pdf.addImage(backCanvas.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, 794, 595);

      pdf.save(`${cert.certificateId}-GTL-Certificate.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Could not generate PDF: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div aria-hidden="true"
        style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none", zIndex: -999 }}>
        <CertFront cert={cert} imageBase64={imageBase64} pageRef={frontRef} />
        <div style={{ marginTop: "20px" }}>
          <CertBack backRef={backRef} />
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className={compact
          ? "flex-1 text-center py-2 rounded-sm text-[10px] tracking-[0.1em] uppercase border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
          : "btn-gold flex-1 text-center px-8 py-4 rounded-sm text-xs"}
        style={compact ? {} : { minWidth: "240px" }}
      >
        {loading ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "11px", height: "11px", border: "2px solid currentColor",
              borderTopColor: "transparent", borderRadius: "50%", display: "inline-block",
              animation: "spin 0.7s linear infinite" }} />
            Generating PDF…
          </span>
        ) : compact ? "↓ GTL PDF" : "↓ Download GTL Certificate PDF"}
      </button>
    </>
  );
}

// ─── Navbar logo ──────────────────────────────────────────────────────────────
export function GTLNavLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
      <polygon points="60,4 116,60 60,116 4,60" fill="none" stroke="#C9A84C" strokeWidth="5" />
      <polygon points="60,18 102,60 60,102 18,60" fill="none" stroke="#C9A84C" strokeWidth="2" />
      <polygon points="60,28 78,48 60,74 42,48" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="42" y1="48" x2="78" y2="48" stroke="#C9A84C" strokeWidth="1.5"/>
      <text x="60" y="102" textAnchor="middle" fontSize="20" fontWeight="900"
        fontFamily="Arial,sans-serif" fill="#C9A84C">GTL</text>
    </svg>
  );
}
