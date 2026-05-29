const Certificate = require("../models/Certificate");
const QRCode = require("qrcode");

const fileUrl = (req, filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  const protocol = req.protocol;
  const host = req.get("host");
  let n = filePath.replace(/\\/g, "/");
  const idx = n.indexOf("uploads/");
  if (idx !== -1) n = n.slice(idx);
  return `${protocol}://${host}/${n}`;
};

exports.createCertificate = async (req, res) => {
  try {
    const {
      certificateId, ownerName, jewelryType, gemstone, weight,
      color, clarity, cut, origin,
      opticalClass, opticalCharacter, refractiveIndex, dimensions,
      description, conclusion, specificComments, issuedBy,
    } = req.body;

    const image           = req.files?.image?.[0]?.path || "";
    const certificateFile = req.files?.pdf?.[0]?.path   || "";

    const baseUrl  = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${baseUrl}/certificate/${certificateId.trim().toUpperCase()}`;
    const qrCode   = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "H", width: 300, margin: 2,
      color: { dark: "#1a1a1a", light: "#FFFFFF" },
    });

    const cert = new Certificate({
      certificateId: certificateId.trim().toUpperCase(),
      ownerName, jewelryType,
      gemstone: gemstone || "Diamond",
      weight,
      color: color || "", clarity: clarity || "", cut: cut || "", origin: origin || "",
      opticalClass: opticalClass || "", opticalCharacter: opticalCharacter || "",
      refractiveIndex: refractiveIndex || "", dimensions: dimensions || "",
      description: description || "",
      conclusion: conclusion || "Result Confirm Natural Origin",
      specificComments: specificComments || "",
      image, certificateFile, qrCode,
      issuedBy: issuedBy || "GEM TESTING LABORATORY, Bareilly",
    });

    await cert.save();
    res.status(201).json({ success: true, message: "Certificate Created", certificate: cert });
  } catch (error) {
    console.error("createCertificate:", error);
    if (error.code === 11000)
      return res.status(409).json({ success: false, message: "Certificate ID already exists." });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? {
      $or: [
        { certificateId: { $regex: search, $options: "i" } },
        { ownerName:     { $regex: search, $options: "i" } },
        { jewelryType:   { $regex: search, $options: "i" } },
      ],
    } : {};
    const certs = await Certificate.find(query).sort({ createdAt: -1 });
    res.json({ success: true, certificates: certs });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    const id = req.params.id.trim().toUpperCase();
    const cert = await Certificate.findOne({ certificateId: { $regex: `^${id}$`, $options: "i" } });
    console.log(`🔍 "${id}" → ${cert ? "FOUND" : "NOT FOUND"}`);
    if (!cert) return res.status(404).json({ success: false, message: "Certificate Not Found" });

    cert.scanCount   = (cert.scanCount || 0) + 1;
    cert.lastScanned = new Date();
    await cert.save();

    const obj = cert.toObject();
    obj.imageUrl = fileUrl(req, cert.image);
    obj.pdfUrl   = fileUrl(req, cert.certificateFile);
    res.json({ success: true, certificate: obj });
  } catch (e) {
    console.error("getCertificateById:", e);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.image) updates.image           = req.files.image[0].path;
    if (req.files?.pdf)   updates.certificateFile = req.files.pdf[0].path;
    const cert = await Certificate.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!cert) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, certificate: cert });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, message: "Deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Delete Failed" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const total  = await Certificate.countDocuments();
    const active = await Certificate.countDocuments({ status: "active" });
    const scans  = await Certificate.aggregate([{ $group: { _id: null, t: { $sum: "$scanCount" } } }]);
    const recent = await Certificate.find().sort({ createdAt: -1 }).limit(5)
      .select("certificateId ownerName jewelryType createdAt scanCount");
    res.json({ success: true, analytics: { total, active, totalScans: scans[0]?.t || 0, recent } });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
