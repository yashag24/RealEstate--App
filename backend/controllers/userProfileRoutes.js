const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  saveSearchHistory,
  userPastHistory,
  saveProperty,
  getUserSavedProperties,
  removeSavedProperty,
  previousView,
  isPropertySaved,
} = require("../controllers/userProfileController.js");
const { upload } = require("../middleware/multer.middleware.js");
const { authenticate } = require("../middleware/auth.js");

router.get("/:id", authenticate, getUserProfile);
router.put("/:id", authenticate, upload.single("image"), updateUserProfile);
router.get("/:userId/past-searches", userPastHistory);
router.post("/search-history", saveSearchHistory);
router.post("/save-property", saveProperty);
router.post("/is-property-saved", isPropertySaved);

router.delete(
  "/:userId/remove-saved-property/:propertyId",
  removeSavedProperty
);
router.get("/:userId/saved-properties", getUserSavedProperties);
router.post("/previous-view", previousView);

module.exports = router;
