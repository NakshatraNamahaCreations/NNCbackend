const express = require("express");
const router = express.Router();
const { createEnquiry, getAllEnquiries, countEnquiriesByCity , getMonthlyEnquiryCount, getMonthlyBangaloreEnquiryCount} = require("../Controllers/enquiryController");

router.post("/", createEnquiry);
router.get("/", getAllEnquiries);
router.get("/count", countEnquiriesByCity);
router.get("/monthly-count", getMonthlyEnquiryCount);
router.get("/monthly-count-bangalore", getMonthlyBangaloreEnquiryCount);

module.exports = router;