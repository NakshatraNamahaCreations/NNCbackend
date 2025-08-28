const Enquiry = require("../models/Enquiry");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

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


const countEnquiriesByCity = asyncHandler(async (req, res) => {
  const cities = ["Bangalore", "Mysore"];
  
  const enquiryCounts = await Enquiry.aggregate([
    {
      $match: { city: { $in: cities } } // Filter for Bangalore and Mysore
    },
    {
      $group: {
        _id: "$city", // Group by city
        count: { $sum: 1 } // Count inquiries per city
      }
    }
  ]);

  // Format the response to include counts for both cities (even if zero)
  const result = {
    Bangalore: 0,
    Mysore: 0
  };

  enquiryCounts.forEach(item => {
    result[item._id] = item.count;
  });

  res.status(200).json(result);
});


const getMonthlyEnquiryCount = asyncHandler(async (req, res) => {
  const monthlyCounts = await Enquiry.aggregate([
    {
      $match: { city: "Mysore" } // Filter for Mysore
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
    },
    {
      $project: {
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $cond: [{ $lt: ["$_id.month", 10] }, "0", ""] },
            { $toString: "$_id.month" }
          ]
        },
        count: 1,
        _id: 0
      }
    }
  ]);

  res.status(200).json(monthlyCounts);
});


const getMonthlyBangaloreEnquiryCount = asyncHandler(async (req, res) => {
  const monthlyCounts = await Enquiry.aggregate([
    {
      $match: { city: "Bangalore" } // Filter for Bangalore
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
    },
    {
      $project: {
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            { $cond: [{ $lt: ["$_id.month", 10] }, "0", ""] },
            { $toString: "$_id.month" }
          ]
        },
        count: 1,
        _id: 0
      }
    }
  ]);

  res.status(200).json(monthlyCounts);
});


const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid enquiry id" });
    }

  const deleted = await Enquiry.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Enquiry not found" });
  }

  res.status(200).json({ message: "Enquiry deleted", _id: id });
});



module.exports = {
  createEnquiry,
  getAllEnquiries,
  countEnquiriesByCity,
  getMonthlyEnquiryCount,
  getMonthlyBangaloreEnquiryCount,
  deleteEnquiry,
};