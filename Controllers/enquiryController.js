const Enquiry = require("../models/Enquiry");
const asyncHandler = require("express-async-handler");

// Create a new enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  const { name, phoneNo, email, service, message, referenceFrom, city } = req.body;

  // Check if at least one field is provided
  if (!name && !phoneNo && !email && !service && !message && !referenceFrom && !city) {
    res.status(400);
    throw new Error("Please provide at least one field");
  }

  const enquiry = await Enquiry.create({
    name,
    phoneNo,
    email,
    service,
    message,
    referenceFrom,
    city,
  });

  if (enquiry) {
    res.status(201).json({
      _id: enquiry._id,
      name: enquiry.name,
      phoneNo: enquiry.phoneNo,
      email: enquiry.email,
      service: enquiry.service,
      message: enquiry.message,
      referenceFrom: enquiry.referenceFrom,
      city: enquiry.city,
      createdAt: enquiry.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid enquiry data");
  }
});

// Get all enquiries
const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
  res.status(200).json(enquiries);
});

module.exports = {
  createEnquiry,
  getAllEnquiries,
};