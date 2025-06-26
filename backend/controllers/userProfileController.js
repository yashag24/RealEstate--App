const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cloudinary = require("../util/cloudinary");

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      name,
      mail,
      phoneNumber,
      landlineNumber,
      city,
      state,
      address,
      removeImage,
    } = req.body;

    // Handle image upload to Cloudinary
    let imageURL = null;
    if (req.file) {
      // Upload the image to Cloudinary and get the URL and public_id
      const uploadedImage = await cloudinary.uploadOnCloudinary(req.file.path);
      imageURL = uploadedImage?.secure_url; // Cloudinary image URL
    }

    // If user wants to remove image, delete the image from Cloudinary
    if (removeImage === "true" && req.body.imagePublicId) {
      await cloudinary.deleteFromCloudinary(req.body.imagePublicId);
      imageURL = null; // Remove image URL from the user's profile
    }

    const updatedData = {
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1] || "",
      email: mail,
      phoneNumber,
      landlineNumber,
      city,
      state,
      address,
      image: imageURL,
    };

    // Update the user profile in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      {
        id: updatedUser._id,
        firstname: updatedUser.firstName,
        lastname: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        city: updatedUser.city,
        state: updatedUser.state,
        address: updatedUser.address,
        landlineNumber: updatedUser.landlineNumber,
        image: updatedUser.image,
      },
      "bearer",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      token,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userPastHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json(userData.searches);
  } catch (error) {
    console.error("Error fetching user search history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const saveSearchHistory = async (req, res) => {
  try {
    const { search_text, userId } = req.body;

    if (!search_text || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const now = new Date();

    const roundedNow = new Date(now);
    roundedNow.setSeconds(0, 0);

    let userSearchDoc = await User.findById(userId);

    if (!userSearchDoc) {
      userSearchDoc = new User({
        ...userSearchDoc,
        searches: [{ search_text, search_datetime: roundedNow }],
      });
      await userSearchDoc.save();
      return res.status(200).json({ message: "Search saved (first)" });
    }

    const isDuplicate = userSearchDoc.searches.some((entry) => {
      const entryTime = new Date(entry.search_datetime);
      entryTime.setSeconds(0, 0); // Round to minute
      return (
        entry.search_text.toLowerCase() === search_text.toLowerCase() &&
        entryTime.getTime() === roundedNow.getTime()
      );
    });

    if (isDuplicate) {
      return res.status(200).json({ message: "Duplicate search ignored" });
    }

    userSearchDoc.searches.push({
      search_text,
      search_datetime: roundedNow,
    });
    await userSearchDoc.save();

    return res.status(200).json({ message: "Search saved" });
  } catch (error) {
    console.error("Error saving search history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const saveProperty = async (req, res) => {
  try {
    const { propertyId, userId } = req.body;

    if (!userId || !propertyId) {
      return res
        .status(400)
        .json({ error: "User ID and Property ID are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.saveProperties)) {
      user.saveProperties = [];
    }

    const index = user.saveProperties.findIndex(
      (p) => p.propertyId.toString() === propertyId
    );

    if (index > -1) {
      // Property already saved -> Unsave it
      user.saveProperties.splice(index, 1);
      await user.save();
      return res.status(200).json({
        message: "Property unsaved successfully",
        saveProperties: user.saveProperties,
      });
    } else {
      // Property not saved -> Save it
      user.saveProperties.push({ propertyId });
      await user.save();
      return res.status(200).json({
        message: "Property saved successfully",
        saveProperties: user.saveProperties,
      });
    }
  } catch (error) {
    console.error("Error saving/unsaving property:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const isPropertySaved = async (req, res) => {
  const { userId, propertyId } = req.body;

  if (!userId || !propertyId) {
    return res
      .status(400)
      .json({ error: "User ID and Property ID are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isSaved = user.saveProperties.some(
      (p) => p.propertyId.toString() === propertyId
    );

    return res.status(200).json({ isSaved });
  } catch (error) {
    console.error("Error checking saved status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const removeSavedProperty = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;

    if (!userId || !propertyId) {
      return res
        .status(400)
        .json({ error: "User ID and Property ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure saveProperties array exists or initialize it
    if (!Array.isArray(user.saveProperties)) {
      user.saveProperties = [];
    }

    const initialLength = user.saveProperties.length;

    // Remove the saved property
    user.saveProperties = user.saveProperties.filter(
      (p) => p.propertyId.toString() !== propertyId.toString()
    );

    // If no property was removed, return a message
    if (user.saveProperties.length === initialLength) {
      return res
        .status(404)
        .json({ message: "Property not found in saved list" });
    }

    await user.save();

    return res.status(200).json({
      message: "Property removed successfully",
      saveProperties: user.saveProperties,
    });
  } catch (error) {
    console.error("Error removing saved property:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserSavedProperties = async (req, res) => {
  try {
    const { userId } = req.params;

    // console.log(userId);

    const user = await User.findById(userId).populate(
      "saveProperties.propertyId"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      saveProperties: user.saveProperties,
    });
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const previousView = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId).populate(
      "previousView.propertyId"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.previousView)) {
      user.previousView = [];
    }

    if (propertyId) {
      const alreadyViewed = user.previousView.some(
        (view) => view.propertyId._id.toString() === propertyId.toString()
      );

      if (!alreadyViewed) {
        user.previousView.push({ propertyId });
        await user.save();
        await user.populate("previousView.propertyId");
      }

      return res.status(200).json({
        message: "Property added to previous views",
        previousView: user.previousView,
      });
    }

    return res.status(200).json({
      message: "Previously viewed properties fetched successfully",
      previousView: user.previousView,
    });
  } catch (error) {
    console.error("Error in previousView:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  saveSearchHistory,
  userPastHistory,
  saveProperty,
  removeSavedProperty,
  getUserSavedProperties,
  previousView,
  isPropertySaved,
};
