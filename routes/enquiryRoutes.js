const express = require("express");
const router = express.Router();
const { createEnquiry, getAllEnquiries } = require("../Controllers/enquiryController");

router.post("/", createEnquiry);
router.get("/", getAllEnquiries);

module.exports = router;