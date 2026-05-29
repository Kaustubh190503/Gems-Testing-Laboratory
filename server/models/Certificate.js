const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, trim: true },
    ownerName:     { type: String, required: true, trim: true },
    jewelryType:   { type: String, required: true },
    gemstone:      { type: String, default: "Diamond" },
    weight:        { type: String, required: true },

    // Grading
    color:   { type: String, default: "" },
    clarity: { type: String, default: "" },
    cut:     { type: String, default: "" },
    origin:  { type: String, default: "" },

    // Optical Properties
    opticalClass:     { type: String, default: "" },
    opticalCharacter: { type: String, default: "" },
    refractiveIndex:  { type: String, default: "" },

    // Physical Properties
    dimensions: { type: String, default: "" },

    // Certificate title (shown on the certificate document)
    certificateTitle: { type: String, default: "" },

    // Remarks
    description:      { type: String, default: "" },
    conclusion:       { type: String, default: "Result Confirm Natural Origin" },
    specificComments: { type: String, default: "" },

    image:           { type: String, default: "" },
    certificateFile: { type: String, default: "" },
    qrCode:          { type: String, default: "" },

    status:      { type: String, enum: ["active", "suspended", "revoked"], default: "active" },
    scanCount:   { type: Number, default: 0 },
    lastScanned: { type: Date },
    issuedBy:    { type: String, default: "GEM TESTING LABORATORY, Bareilly" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
