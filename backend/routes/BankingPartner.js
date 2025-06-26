const express = require("express");
const router = express.Router();
const {
  getAllBankingPartners,
  getBankingPartnerById,
  getLoanOptionsForProperty,
  createBankingPartner,
  updateBankingPartner,

  deleteBankingPartner,
} = require("../controllers/BankingPartner.js");

// Public routes - accessible to all users

/**
 * @route   GET /api/banking-partners
 * @desc    Get all banking partners with pagination and filtering
 * @access  Public
 * @params  ?page=1&limit=10&sortBy=bankName&sortOrder=asc&isActive=true&partnershipType=preferred&productType=home_loan
 */
router.get("/", getAllBankingPartners);

/**
 * @route   GET /api/banking-partners/:id
 * @desc    Get banking partner by ID
 * @access  Public
 */
router.get("/:id", getBankingPartnerById);

/**
 * @route   GET /api/banking-partners/loan-options/:propertyId
 * @desc    Get loan options for a specific property
 * @access  Public
 * @params  ?loanAmount=5000000&preferredTenure=20&employmentType=salaried&monthlyIncome=100000&creditScore=750
 */
router.get("/loan-options/:propertyId", getLoanOptionsForProperty);

// Admin routes - require authentication and admin privileges
// Note: Add authentication middleware before these routes in your main app

/**
 * @route   POST /api/banking-partners
 * @desc    Create new banking partner
 * @access  Private (Admin only)
 */
router.post("/", createBankingPartner);

/**
 * @route   PUT /api/banking-partners/:id
 * @desc    Update banking partner
 * @access  Private (Admin only)
 */
router.put("/:id", updateBankingPartner);

/**
 * @route   DELETE /api/banking-partners/:id
 * @desc    Delete banking partner
 * @access  Private (Admin only)
 */
router.delete("/:id", deleteBankingPartner);

// Additional utility routes

/**
 * @route   GET /api/banking-partners/search/by-product
 * @desc    Search banking partners by product type
 * @access  Public
 */
router.get("/search/by-product", (req, res) => {
  const { productType } = req.query;
  req.query.productType = productType;
  getAllBankingPartners(req, res);
});

/**
 * @route   GET /api/banking-partners/search/by-location
 * @desc    Search banking partners by location (city)
 * @access  Public
 */
router.get("/search/by-location", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City parameter is required",
      });
    }

    const BankingPartner = require("../models/BankingPartner");

    const partners = await BankingPartner.find({
      isActive: true,
      $or: [
        { "contactDetails.city": { $regex: city, $options: "i" } },
        { "branchLocations.city": { $regex: city, $options: "i" } },
      ],
    }).select(
      "bankName bankCode contactDetails rating logo website branchLocations"
    );

    res.status(200).json({
      success: true,
      data: partners,
      count: partners.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching banking partners by location",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/banking-partners/compare/:propertyId
 * @desc    Compare loan offers from multiple banks for a property
 * @access  Public
 */
router.get("/compare/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { bankIds } = req.query; // Comma-separated bank IDs

    if (!bankIds) {
      return res.status(400).json({
        success: false,
        message: "Bank IDs are required for comparison",
      });
    }

    const BankingPartner = require("../models/BankingPartner");
    const Property = require("../models/property");

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const bankIdArray = bankIds.split(",");
    const banks = await BankingPartner.find({
      _id: { $in: bankIdArray },
      isActive: true,
    });

    // Use the same logic as getLoanOptionsForProperty but for specific banks
    const {
      calculatePropertyScore,
      findOptimalLoanOffers,
    } = require("../controllers/bankingPartnerController");
    const propertyScore = calculatePropertyScore(property);
    const loanOffers = findOptimalLoanOffers(property, banks, propertyScore);

    res.status(200).json({
      success: true,
      propertyDetails: {
        id: property._id,
        title: property.title,
        price: property.price,
        propertyScore: propertyScore,
      },
      comparison: loanOffers,
      comparisonDate: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error comparing loan offers",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/banking-partners/emi-calculator
 * @desc    EMI calculator utility
 * @access  Public
 */
router.get("/emi-calculator", (req, res) => {
  try {
    const { principal, rate, tenure } = req.query;

    if (!principal || !rate || !tenure) {
      return res.status(400).json({
        success: false,
        message: "Principal, rate, and tenure are required",
      });
    }

    const calculateEMI = (p, r, t) => {
      const monthlyRate = r / (12 * 100);
      const numberOfPayments = t * 12;
      const emi =
        (p * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      return Math.round(emi);
    };

    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);

    const emi = calculateEMI(p, r, t);
    const totalAmount = emi * t * 12;
    const totalInterest = totalAmount - p;

    res.status(200).json({
      success: true,
      calculation: {
        principal: p,
        interestRate: r,
        tenure: t,
        emi: emi,
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        breakdown: {
          monthlyEMI: emi,
          totalPayments: t * 12,
          principalAmount: p,
          interestAmount: Math.round(totalInterest),
          totalPayable: Math.round(totalAmount),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating EMI",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/banking-partners/statistics
 * @desc    Get banking partners statistics
 * @access  Public
 */
router.get("/statistics", async (req, res) => {
  try {
    const BankingPartner = require("../models/BankingPartner");

    const stats = await BankingPartner.aggregate([
      {
        $group: {
          _id: null,
          totalPartners: { $sum: 1 },
          activePartners: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
          averageRating: { $avg: "$rating" },
          partnershipTypes: {
            $push: "$partnershipDetails.partnershipType",
          },
          totalLoanProducts: {
            $sum: { $size: "$loanProducts" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalPartners: 1,
          activePartners: 1,
          inactivePartners: {
            $subtract: ["$totalPartners", "$activePartners"],
          },
          averageRating: { $round: ["$averageRating", 2] },
          totalLoanProducts: 1,
          partnershipDistribution: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$partnershipTypes", []] },
                as: "type",
                in: {
                  k: "$type",
                  v: {
                    $size: {
                      $filter: {
                        input: "$partnershipTypes",
                        cond: { $eq: ["$this", "$type"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    // Get product type statistics
    const productStats = await BankingPartner.aggregate([
      { $unwind: "$loanProducts" },
      {
        $group: {
          _id: "$loanProducts.productType",
          count: { $sum: 1 },
          avgInterestRate: { $avg: "$loanProducts.interestRate.min" },
          maxLoanAmount: { $max: "$loanProducts.loanAmount.max" },
        },
      },
      {
        $project: {
          productType: "$_id",
          count: 1,
          avgInterestRate: { $round: ["$avgInterestRate", 2] },
          maxLoanAmount: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      generalStats: stats[0] || {},
      productTypeStats: productStats,
      generatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
});

module.exports = router;
