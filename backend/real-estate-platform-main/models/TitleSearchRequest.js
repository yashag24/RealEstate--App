const mongoose = require("mongoose");

const TitleSearchRequestSchema = new mongoose.Schema({
  ContactFullName: { type: String, required: true },
  ContactEmail: { type: String, required: true },
  ContactPhone: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  PropertyCity: { type: String, required: true },
  PropertyState: { type: String, required: true },
  propertyType: { type: String, required: true },
  PropertyRegistrationNumber: { type: String },
  ContactNotes: { type: String },
  propertyDocuments: [
    {
      url: { type: String },
      public_id: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const TitleSearchRequest = mongoose.model(
  "TitleSearchRequest",
  TitleSearchRequestSchema
);

module.exports = TitleSearchRequest;
