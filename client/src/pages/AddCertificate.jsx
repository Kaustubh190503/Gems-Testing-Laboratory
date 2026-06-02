import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import Navbar from "../components/Navbar";

const IC = "luxury-input w-full px-5 py-3.5 rounded-sm text-xs tracking-widest";

export default function AddCertificate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    certificateId: "", ownerName: "To Whom It May Concern", jewelryType: "", naturalStamp: "",
    gemstone: "Diamond", weight: "",
    certificateTitle: "Diamond Jewellery Identification Certificate",
    // Grading
    color: "", clarity: "", cut: "", origin: "",
    // Optical
    opticalClass: "", opticalCharacter: "", refractiveIndex: "",
    // Physical
    dimensions: "",
    // Remarks
    description: "", conclusion: "Result Confirm Natural Origin", specificComments: "",
    issuedBy: "GEM TESTING LABORATORY, Bareilly",
  });

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    setImage(f);
    if (f) setPreviewImage(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { alert("Please upload a jewelry image."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", image);
      const res = await api.post("/certificates", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data.success) navigate(`/certificate/${res.data.certificate.certificateId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save certificate.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <div className="mb-10">
            <Link to="/admin/dashboard" className="text-[9px] tracking-[0.3em] text-muted/50 uppercase hover:text-gold/60 transition-colors">← Dashboard</Link>
            <p className="text-[10px] tracking-[0.4em] text-gold/60 uppercase mt-4 mb-2">Administration</p>
            <h1 className="font-display text-4xl md:text-5xl text-[#F0EAD6] font-light">
              Issue <span className="text-gold-gradient italic">Certificate</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              {/* ── LEFT ── */}
              <div className="space-y-6">
                <Sec title="Identification">
                  <F label="Certificate ID *" hint="e.g. GIC-3807">
                    <input type="text" name="certificateId" value={form.certificateId} onChange={set}
                      required placeholder="GIC-3807" className={IC} style={{ textTransform:"uppercase" }} />
                  </F>
                  <F label="Owner / Customer Name">
                    <input type="text" name="ownerName" value="To Whom It May Concern"
                      readOnly className={IC + " opacity-60 cursor-not-allowed"} />
                  </F>
                </Sec>

                <Sec title="Gemstone Details">
                  <F label="Gemstone Type *" hint="e.g. Diamond, Ruby, Emerald">
                    <input type="text" name="gemstone" value={form.gemstone} onChange={set}
                      required placeholder="Diamond" className={IC} />
                  </F>
                  <F label="Jewelry Type" hint="e.g. Ring, Necklace, Pendant">
                    <input type="text" name="jewelryType" value={form.jewelryType} onChange={set}
                      placeholder="Ring" className={IC} />
                  </F>
                  <F label="Est. Weight *" hint="e.g. 0.075">
                    <input type="text" name="weight" value={form.weight} onChange={set}
                      required placeholder="0.075 ct" className={IC} />
                  </F>
                </Sec>

                <Sec title="Certificate Title">
                  <F label="Title shown on certificate *" hint="e.g. Ruby Jewellery Identification Certificate">
                    <input type="text" name="certificateTitle" value={form.certificateTitle} onChange={set}
                      required placeholder="Diamond Jewellery Identification Certificate" className={IC} />
                  </F>
                  <F label="Natural Stamp" hint="e.g. Natural Diamond (leave blank for default)">
                    <input type="text" name="naturalStamp" value={form.naturalStamp} onChange={set}
                      placeholder="Natural Diamond" className={IC} />
                  </F>
                </Sec>

                <Sec title="Grading">
                  <div className="grid grid-cols-2 gap-4">
                    <F label="Color" hint="e.g. I-J"><input type="text" name="color" value={form.color} onChange={set} placeholder="I-J" className={IC} /></F>
                    <F label="Clarity" hint="e.g. S.I"><input type="text" name="clarity" value={form.clarity} onChange={set} placeholder="S.I" className={IC} /></F>
                    <F label="Type of Cut" hint="e.g. Round Brilliant"><input type="text" name="cut" value={form.cut} onChange={set} placeholder="Round Brilliant Cut" className={IC} /></F>
                    <F label="Origin"><input type="text" name="origin" value={form.origin} onChange={set} placeholder="Natural" className={IC} /></F>
                  </div>
                </Sec>
              </div>

              {/* ── RIGHT ── */}
              <div className="space-y-6">
                <Sec title="Optical Properties">
                  <F label="Optical Class" hint="e.g. Anisotropic, Isotropic">
                    <input type="text" name="opticalClass" value={form.opticalClass} onChange={set} placeholder="Anisotropic" className={IC} />
                  </F>
                  <F label="Optical Character" hint="e.g. Uniaxial (+/-), Biaxial">
                    <input type="text" name="opticalCharacter" value={form.opticalCharacter} onChange={set} placeholder="Uniaxial (+)" className={IC} />
                  </F>
                  <F label="Refractive Index" hint="e.g. 2.417">
                    <input type="text" name="refractiveIndex" value={form.refractiveIndex} onChange={set} placeholder="2.417" className={IC} />
                  </F>
                </Sec>

                <Sec title="Physical Properties">
                  <F label="Dimensions" hint="e.g. 3.20 × 2.90 × 1.80 mm">
                    <input type="text" name="dimensions" value={form.dimensions} onChange={set} placeholder="3.20 × 2.90 × 1.80 mm" className={IC} />
                  </F>
                </Sec>

                <Sec title="Report Conclusion">
                  <F label="Description / Remarks" hint="e.g. Gold Nose Ring, Hallmark 585, Net wt. 0.465 gms">
                    <textarea name="description" value={form.description} onChange={set}
                      placeholder="Gold Nose Ring, Hallmark 585, Net wt. 0.465 gms"
                      rows={2} className={IC + " resize-none"} />
                  </F>
                  <F label="Conclusion">
                    <input type="text" name="conclusion" value={form.conclusion} onChange={set}
                      placeholder="Result Confirm Natural Origin" className={IC} />
                  </F>
                  <F label="Specific Comments">
                    <textarea name="specificComments" value={form.specificComments} onChange={set}
                      placeholder="Any additional observations or comments…"
                      rows={3} className={IC + " resize-none"} />
                  </F>
                  <F label="Issuing Laboratory">
                    <input type="text" name="issuedBy" value={form.issuedBy} onChange={set} className={IC} />
                  </F>
                </Sec>
              </div>
            </div>

            {/* ── IMAGE UPLOAD ONLY ── */}
            <Sec title="Jewelry Image">
              <div className="max-w-xs">
                <label className="block text-[9px] tracking-[0.3em] text-muted uppercase mb-3">Upload Image *</label>
                <label className="glass-card rounded-sm border-dashed border-gold/20 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-gold/40 transition-colors group">
                  {previewImage ? (
                    <img src={previewImage} alt="preview" className="w-full h-32 object-contain rounded" />
                  ) : (
                    <>
                      <span className="font-display text-3xl text-gold/20 group-hover:text-gold/40 transition-colors mb-3">◆</span>
                      <span className="text-[10px] tracking-[0.25em] text-muted uppercase">Click to upload image</span>
                      <span className="text-[9px] text-muted/50 mt-1">JPG, PNG, WebP</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                </label>
              </div>
            </Sec>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={saving} className="btn-gold flex-1 py-4 rounded-sm text-xs">
                {saving ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-3 h-3 border border-noir/50 border-t-noir rounded-full animate-spin" />
                    Generating Certificate & QR Code…
                  </span>
                ) : "Issue Certificate + Generate QR"}
              </button>
              <Link to="/admin/dashboard" className="btn-ghost px-8 py-4 rounded-sm text-xs">Cancel</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Sec({ title, children }) {
  return (
    <div className="glass-card rounded-sm p-6 space-y-5">
      <p className="text-[9px] tracking-[0.4em] text-gold/50 uppercase border-b border-gold/8 pb-4">{title}</p>
      {children}
    </div>
  );
}
function F({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[9px] tracking-[0.3em] text-muted uppercase mb-2">
        {label}{hint && <span className="ml-2 text-muted/40 normal-case tracking-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}