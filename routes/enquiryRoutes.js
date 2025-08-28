const express = require("express");
const router = express.Router();
const { createEnquiry, getAllEnquiries, countEnquiriesByCity , getMonthlyEnquiryCount, getMonthlyBangaloreEnquiryCount, deleteEnquiry} = require("../Controllers/enquiryController");

router.post("/", createEnquiry);
router.get("/", getAllEnquiries);
router.get("/count", countEnquiriesByCity);
router.get("/monthly-count", getMonthlyEnquiryCount);
router.get("/monthly-count-bangalore", getMonthlyBangaloreEnquiryCount);
router.delete("/:id", deleteEnquiry);

module.exports = router;