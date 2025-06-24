// controllers/ContractorController.js

const Contractor = require("../models/Contractor.js");
const { uploadOnCloudinary } = require("../util/cloudinary");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const createContractor = async (req, res) => {
  try {
    // Log incoming payload for debugging
    // console.log("BODY:", req.body);
    // console.log(
    //   "FILES:",
    //   req.files.map((f) => ({ field: f.fieldname, name: f.originalname }))
    // );

    const { name, phone, email, location, serviceType } = req.body;

    // 1) Build initial portfolio array if body-parser already parsed it
    let portfolio = [];
    if (Array.isArray(req.body.portfolio)) {
      portfolio = req.body.portfolio.map((proj) => ({
        title: proj.title,
        description: proj.description,
        completedOn: proj.completedOn,
        location: proj.location,
        images: [],
      }));
    } else {
      // 2) Fallback: manual parsing of indexed fields
      const map = {};
      for (const key of Object.keys(req.body)) {
        const m = key.match(/^portfolio\[(\d+)\]\[(\w+)\]$/);
        if (!m) continue;
        const idx = m[1],
          field = m[2];
        map[idx] = map[idx] || { images: [] };
        map[idx][field] = req.body[key];
      }
      portfolio = Object.values(map).map((p) => ({
        title: p.title,
        description: p.description,
        completedOn: p.completedOn,
        location: p.location,
        images: [],
      }));
    }

    // 3) Group uploaded files by portfolio index
    const filesByIndex = {};
    (req.files || []).forEach((file) => {
      const m = file.fieldname.match(/^portfolio\[(\d+)\]\[images\]$/);
      if (!m) return;
      const idx = m[1];
      filesByIndex[idx] = filesByIndex[idx] || [];
      filesByIndex[idx].push(file);
    });

    // 4) Write buffers to temp files, upload, then cleanup
    await Promise.all(
      Object.entries(filesByIndex).map(async ([idx, files]) => {
        // ensure portfolio[idx] exists
        if (!portfolio[idx]) {
          portfolio[idx] = {
            title: "",
            description: "",
            completedOn: "",
            location: "",
            images: [],
          };
        }

        const urls = await Promise.all(
          files.map(async (file) => {
            const tempPath = path.join(
              os.tmpdir(),
              `${Date.now()}-${Math.random().toString(36).slice(2)}-${
                file.originalname
              }`
            );
            try {
              await fs.writeFile(tempPath, file.buffer);
              const resp = await uploadOnCloudinary(tempPath);
              return resp && resp.url ? resp.url : null;
            } catch (e) {
              console.error("uploadOnCloudinary error:", e);
              return null;
            } finally {
              await fs.unlink(tempPath).catch(() => {});
            }
          })
        );

        portfolio[idx].images = urls.filter((u) => u);
      })
    );

    // 5) Filter out any incomplete entries
    const finalPortfolio = portfolio.filter(
      (p) =>
        p.title &&
        p.description &&
        p.completedOn &&
        p.location &&
        Array.isArray(p.images) &&
        p.images.length > 0
    );

    // 6) Create and save the new contractor
    const newContractor = new Contractor({
      name,
      phone,
      email,
      location,
      serviceType,
      portfolio: finalPortfolio,
      verified: false,
    });
    await newContractor.save();

    return res.status(201).json({
      success: true,
      contractor: newContractor,
    });
  } catch (err) {
    console.error("createContractor failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error creating contractor",
      error: err.message,
    });
  }
};

const getAllContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find();
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contractors" });
  }
};
// Get all contractors (verified)
const getVerifiedContractors = async (req, res) => {
  try {
    const filter = {};
    filter.verified = true;
    const contractors = await Contractor.find(filter);
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contractors" });
  }
};

// Get a single contractor by ID
const getContractorById = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor)
      return res.status(404).json({ error: "Contractor not found" });
    res.status(200).json(contractor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contractor" });
  }
};

// Update contractor details
const updateContractor = async (req, res) => {
  try {
    const contractorId = req.params.id;
    // Basic fields
    const { name, phone, email, location, serviceType } = req.body;

    // 1) Start building update payload
    const update = { name, phone, email, location, serviceType };

    // 2) Parse portfolio text entries (mirrors create logic)
    let portfolio = [];
    if (Array.isArray(req.body.portfolio)) {
      portfolio = req.body.portfolio.map((p) => ({
        title: p.title,
        description: p.description,
        completedOn: p.completedOn,
        location: p.location,
        images: Array.isArray(p.existingImages)
          ? [...p.existingImages]
          : p.existingImages
          ? [p.existingImages]
          : [],
      }));
    } else {
      const map = {};
      Object.keys(req.body).forEach((key) => {
        const m = key.match(/^portfolio\[(\d+)\]\[(\w+)\]$/);
        if (!m) return;
        const [_, idx, field] = m;
        map[idx] = map[idx] || { images: [] };
        if (field === "existingImages") {
          const val = req.body[key];
          map[idx].images.push(...(Array.isArray(val) ? val : [val]));
        } else {
          map[idx][field] = req.body[key];
        }
      });
      portfolio = Object.values(map).map((p) => ({
        title: p.title,
        description: p.description,
        completedOn: p.completedOn,
        location: p.location,
        images: p.images,
      }));
    }

    // 3) Group any newly uploaded files by portfolio index
    const filesByIndex = {};
    (req.files || []).forEach((file) => {
      const m = file.fieldname.match(/^portfolio\[(\d+)\]\[images\]$/);
      if (!m) return;
      const idx = m[1];
      filesByIndex[idx] = filesByIndex[idx] || [];
      filesByIndex[idx].push(file);
    });

    // 4) Upload new images and merge into portfolio entries
    await Promise.all(
      Object.entries(filesByIndex).map(async ([idx, files]) => {
        // ensure entry exists
        portfolio[idx] = portfolio[idx] || {
          title: "",
          description: "",
          completedOn: "",
          location: "",
          images: [],
        };

        const newUrls = await Promise.all(
          files.map(async (file) => {
            const tmp = path.join(
              os.tmpdir(),
              `${Date.now()}-${file.originalname}`
            );
            try {
              await fs.writeFile(tmp, file.buffer);
              const resp = await uploadOnCloudinary(tmp, {
                folder: "contractors",
              });
              return resp?.url || null;
            } finally {
              await fs.unlink(tmp).catch(() => {});
            }
          })
        );
        portfolio[idx].images.push(...newUrls.filter((u) => u));
      })
    );

    // 5) Filter out any entries missing required fields or images
    update.portfolio = portfolio.filter(
      (p) =>
        p.title &&
        p.description &&
        p.completedOn &&
        p.location &&
        Array.isArray(p.images) &&
        p.images.length > 0
    );

    // 6) Perform the update
    const updated = await Contractor.findByIdAndUpdate(
      contractorId,
      update,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, contractor: updated });
  } catch (err) {
    console.error("updateContractor failed:", err);
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

// Delete a contractor
const deleteContractor = async (req, res) => {
  try {
    const deleted = await Contractor.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Contractor not found" });
    res.status(200).json({ message: "Contractor deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contractor" });
  }
};

// Add a new project to contractor's portfolio
const addPortfolioProject = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor)
      return res.status(404).json({ error: "Contractor not found" });

    contractor.portfolio.push(req.body);
    await contractor.save();
    res.status(201).json(contractor);
  } catch (error) {
    res.status(400).json({ error: "Failed to add portfolio project" });
  }
};
//verify
const verifyContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!contractor) {
      return res.status(404).json({ error: "Contractor not found" });
    }
    res.status(200).json({ message: "Contractor verified", contractor });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
};
module.exports = {
  createContractor,
  getVerifiedContractors,
  getContractorById,
  updateContractor,
  deleteContractor,
  addPortfolioProject,
  verifyContractor,
  getAllContractors,
};
