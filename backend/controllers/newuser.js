const { uploadOnCloudinary } = require("../util/cloudinary.js");
const { upload } = require("../middleware/multer.middleware.js");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");

// POST endpoint to create a new user
usersRouter.post(
  "/newuser",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (request, response) => {
    const {
      phoneNumber,
      firstName,
      lastName,
      email,
      password,
      role,
      city,
      state,
      address,
      landlineNumber,
    } = request.body;

    console.log("Request Body:", request.body);

    // Validate password presence
    if (!password) {
      return response.status(400).json({ error: "Password is required" });
    }

    // Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ error: "Email already in use" });
    }

    // Hash the password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Handle cover image upload via Cloudinary
    let coverImageLocalPath;
    if (
      request.files &&
      Array.isArray(request.files.coverImage) &&
      request.files.coverImage.length > 0
    ) {
      coverImageLocalPath = request.files.coverImage[0].path;
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Create the new user object
    const user = new User({
      phoneNumber: phoneNumber,
      firstName,
      lastName,
      email,
      password: passwordHash,
      role,
      image: coverImage?.url || "",
      city: city || "City",
      state: state || "State",
      address: address || "Address",
      landlineNumber: landlineNumber || "0000000000",
      saveProperties: [],
    });

    try {
      // Save the new user to the database
      const savedUser = await user.save();
      response.status(201).json(savedUser); // Return the created user
    } catch (error) {
      // Handle error in saving user
      response
        .status(400)
        .json({ error: "Error saving user", details: error.message });
    }
  }
);

// PUT endpoint to update an existing user's details
usersRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { phoneNumber, firstName, lastName, email, password, image } =
    request.body;

  const updateUser = {};

  if (phoneNumber) updateUser.phoneNumber = phoneNumber;
  if (firstName) updateUser.firstName = firstName;
  if (lastName) updateUser.lastName = lastName;
  if (email) updateUser.email = email;
  if (image) updateUser.image = image;

  // Hash new password if provided
  if (password) {
    const saltRounds = 10;
    updateUser.password = await bcrypt.hash(password, saltRounds);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateUser, {
      new: true, // Return updated document
    });
    if (updatedUser) {
      response.json(updatedUser); // Return updated user
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid user ID" });
  }
});

// DELETE endpoint to remove a user by ID
usersRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      response.status(204).end(); // Successfully deleted, no content returned
    } else {
      response.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "Invalid user ID" });
  }
});

// GET endpoint to fetch all users
usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users); // Return list of users
  } catch (error) {
    response.status(400).json({ error: "Error fetching users" });
  }
});

module.exports = usersRouter;
