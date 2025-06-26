const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 20, // Max 20 files total
  },
});
const {
  createContractor,
  getVerifiedContractors,
  getContractorById,
  updateContractor,
  getAllContractors,
  deleteContractor,
  verifyContractor,
  addPortfolioProject,
} = require("../controllers/ContractorController.js");

// const { authenticate, isAdmin } = require("../middleware/auth");

// 🏗️ Public routes
router.get("/", getAllContractors); // All contractors
router.get("/verified", getVerifiedContractors); // Only verified contractors
router.get("/:id", getContractorById); // View specific contractor

// 🔐 Admin-only routes
router.post("/", upload.any(), createContractor); // Add contractor
router.put("/:id",  upload.any(),updateContractor); // Update contractor
router.delete("/:id", deleteContractor); // Delete contractor
router.put("/verify/:id", verifyContractor); // Verify contractor
router.post("/:id/portfolio", addPortfolioProject); //add project
module.exports = router;
