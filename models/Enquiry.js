const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: [2, "Name must be at least 2 characters if provided"],
  },
  phoneNo: {
    type: String,
    trim: true,
    match: [/^\+?\d{10,15}$/, "Please enter a valid phone number if provided"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email if provided"],
  },
  service: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
    minlength: [10, "Message must be at least 10 characters if provided"],
  },
  referenceFrom: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enquiry", enquirySchema);