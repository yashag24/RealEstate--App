const BankingPartner = require("../models/BankingPartner");
const Property = require("../models/property");

// Helper function to calculate property score
const calculatePropertyScore = (property) => {
  let score = 0;
  const maxScore = 100;

  // Base score factors
  const factors = {
    price: 25,
    location: 20,
    amenities: 15,
    age: 15,
    area: 10,
    verification: 10,
    features: 5,
  };

  // Price scoring (inversely proportional - lower price gets higher score for loan eligibility)
  if (property.price) {
    if (property.price <= 2000000) score += factors.price; // Up to 20L
    else if (property.price <= 5000000) score += factors.price * 0.8; // 20L-50L
    else if (property.price <= 10000000) score += factors.price * 0.6; // 50L-1Cr
    else score += factors.price * 0.4; // Above 1Cr
  }

  // Location scoring (based on city - you can expand this)
  const tierOneCities = ["mumbai", "delhi", "bangalore", "pune", "chennai", "hyderabad", "kolkata", "ahmedabad"];
  const tierTwoCities = ["jaipur", "lucknow", "kanpur", "nagpur", "indore", "thane", "bhopal", "visakhapatnam"];
  
  if (property.city) {
    const city = property.city.toLowerCase();
    if (tierOneCities.includes(city)) {
      score += factors.location;
    } else if (tierTwoCities.includes(city)) {
      score += factors.location * 0.8;
    } else {
      score += factors.location * 0.6;
    }
  }

  // Amenities scoring
  if (property.amenities && property.amenities.length > 0) {
    const amenityScore = Math.min(property.amenities.length / 10, 1) * factors.amenities;
    score += amenityScore;
  }

  // Age of property scoring
  if (property.ageOfProperty) {
    const age = property.ageOfProperty.toLowerCase();
    if (age.includes("new") || age.includes("0") || age.includes("under construction")) {
      score += factors.age;
    } else if (age.includes("1") || age.includes("2") || age.includes("3")) {
      score += factors.age * 0.8;
    } else if (age.includes("4") || age.includes("5") || age.includes("6") || age.includes("7") || age.includes("8") || age.includes("9") || age.includes("10")) {
      score += factors.age * 0.6;
    } else {
      score += factors.age * 0.4;
    }
  }

  // Area scoring
  if (property.area) {
    if (property.area >= 1000) score += factors.area;
    else if (property.area >= 800) score += factors.area * 0.8;
    else if (property.area >= 600) score += factors.area * 0.6;
    else score += factors.area * 0.4;
  }

  // Verification status
  if (property.verification === "verified") {
    score += factors.verification;
  } else if (property.verification === "pending") {
    score += factors.verification * 0.5;
  }

  // Additional features
  let featureCount = 0;
  if (property.other_rooms) {
    featureCount += Object.values(property.other_rooms).filter(Boolean).length;
  }
  if (property.balconies > 0) featureCount++;
  if (property.priceNegotiable) featureCount++;
  
  const featureScore = Math.min(featureCount / 5, 1) * factors.features;
  score += featureScore;

  return Math.min(Math.round(score), maxScore);
};

// Helper function to calculate EMI
const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / (12 * 100);
  const numberOfPayments = tenure * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return Math.round(emi);
};

// Helper function to find optimal loan offers
const findOptimalLoanOffers = (property, banks, propertyScore) => {
  const offers = [];

  banks.forEach(bank => {
    bank.loanProducts.forEach(product => {
      if (!product.isActive) return;

      // Check if property type matches
      const propertyType = property.type ? property.type.toLowerCase() : "residential";
      const matchesPropertyType = product.propertyTypes.length === 0 || 
                                  product.propertyTypes.some(type => 
                                    type.toLowerCase().includes(propertyType) || 
                                    propertyType.includes(type.toLowerCase())
                                  );

      if (!matchesPropertyType) return;

      // Check if property price is within bank's preferred range
      const withinPriceRange = !bank.preferredPropertyValueRange.min || 
                               !bank.preferredPropertyValueRange.max ||
                               (property.price >= bank.preferredPropertyValueRange.min && 
                                property.price <= bank.preferredPropertyValueRange.max);

      if (!withinPriceRange) return;

      // Calculate loan amount based on LTV ratio
      const maxLoanAmount = Math.min(
        property.price * (product.ltvRatio / 100),
        product.loanAmount.max
      );

      if (maxLoanAmount < product.loanAmount.min) return;

      // Adjust interest rate based on property score and bank rating
      let adjustedInterestRate = product.interestRate.min;
      
      // Better properties and better rated banks get lower rates
      const scoreAdjustment = ((100 - propertyScore) / 100) * 
                              (product.interestRate.max - product.interestRate.min);
      const bankAdjustment = ((5 - bank.rating) / 5) * 0.5; // Max 0.5% adjustment for bank rating
      
      adjustedInterestRate += scoreAdjustment + bankAdjustment;
      adjustedInterestRate = Math.min(adjustedInterestRate, product.interestRate.max);

      // Calculate EMI for different tenures
      const emiOptions = [];
      for (let tenure = product.tenure.min; tenure <= product.tenure.max; tenure += 5) {
        const emi = calculateEMI(maxLoanAmount, adjustedInterestRate, tenure);
        emiOptions.push({
          tenure: tenure,
          emi: emi,
          totalAmount: emi * tenure * 12,
          totalInterest: (emi * tenure * 12) - maxLoanAmount
        });
      }

      // Calculate processing fee
      let processingFee = 0;
      if (product.processingFee.percentage > 0) {
        processingFee = (maxLoanAmount * product.processingFee.percentage) / 100;
      }
      if (product.processingFee.fixedAmount > 0) {
        processingFee += product.processingFee.fixedAmount;
      }
      if (product.processingFee.maxAmount && processingFee > product.processingFee.maxAmount) {
        processingFee = product.processingFee.maxAmount;
      }

      offers.push({
        bankName: bank.bankName,
        bankId: bank.bankId,
        bankRating: bank.rating,
        productName: product.productName,
        productType: product.productType,
        maxLoanAmount: Math.round(maxLoanAmount),
        interestRate: parseFloat(adjustedInterestRate.toFixed(2)),
        processingFee: Math.round(processingFee),
        emiOptions: emiOptions,
        features: product.features,
        specialOffers: product.specialOffers.filter(offer => 
          !offer.validTill || new Date(offer.validTill) > new Date()
        ),
        contactPerson: bank.partnershipDetails.contactPerson,
        logo: bank.logo,
        website: bank.website
      });
    });
  });

  // Sort offers by interest rate and bank rating
  return offers.sort((a, b) => {
    if (a.interestRate !== b.interestRate) {
      return a.interestRate - b.interestRate;
    }
    return b.bankRating - a.bankRating;
  });
};

// Get all banking partners
const getAllBankingPartners = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'bankName',
      sortOrder = 'asc',
      isActive,
      partnershipType,
      productType
    } = req.query;

    // Build filter object
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    if (partnershipType) {
      filter['partnershipDetails.partnershipType'] = partnershipType;
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: filter }
    ];

    // Filter by product type if specified
    if (productType) {
      pipeline.push({
        $match: {
          'loanProducts': {
            $elemMatch: {
              'productType': productType,
              'isActive': true
            }
          }
        }
      });
    }

    // Add sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    pipeline.push({ $sort: sortOptions });

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Execute aggregation
    const partners = await BankingPartner.aggregate(pipeline);
    
    // Get total count for pagination
    const totalPartners = await BankingPartner.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: partners,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPartners / parseInt(limit)),
        totalItems: totalPartners,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching banking partners",
      error: error.message
    });
  }
};

// Get banking partner by ID
const getBankingPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await BankingPartner.findById(id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Banking partner not found"
      });
    }

    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching banking partner",
      error: error.message
    });
  }
};

// Get loan options for a specific property
const getLoanOptionsForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { 
      loanAmount, 
      preferredTenure,
      employmentType = "salaried",
      monthlyIncome,
      creditScore = 750 
    } = req.query;

    // Find the property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Calculate property score
    const propertyScore = calculatePropertyScore(property);

    // Get active banking partners
    const banks = await BankingPartner.find({ 
      isActive: true,
      'loanProducts.isActive': true 
    });

    if (banks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active banking partners available"
      });
    }

    // Find optimal loan offers
    let loanOffers = findOptimalLoanOffers(property, banks, propertyScore);

    // Filter offers based on user criteria if provided
    if (monthlyIncome) {
      loanOffers = loanOffers.filter(offer => {
        // Assuming 40% of income can go towards EMI
        const maxAffordableEMI = monthlyIncome * 0.4;
        return offer.emiOptions.some(emi => emi.emi <= maxAffordableEMI);
      });
    }

    // If specific loan amount is requested, filter accordingly
    if (loanAmount) {
      const requestedAmount = parseFloat(loanAmount);
      loanOffers = loanOffers.filter(offer => offer.maxLoanAmount >= requestedAmount);
      
      // Recalculate EMI options for requested amount
      loanOffers = loanOffers.map(offer => {
        const amount = Math.min(requestedAmount, offer.maxLoanAmount);
        const newEmiOptions = offer.emiOptions.map(option => ({
          ...option,
          emi: calculateEMI(amount, offer.interestRate, option.tenure),
          totalAmount: calculateEMI(amount, offer.interestRate, option.tenure) * option.tenure * 12,
          totalInterest: (calculateEMI(amount, offer.interestRate, option.tenure) * option.tenure * 12) - amount
        }));
        
        return {
          ...offer,
          maxLoanAmount: amount,
          emiOptions: newEmiOptions
        };
      });
    }

    res.status(200).json({
      success: true,
      propertyDetails: {
        id: property._id,
        title: property.title,
        price: property.price,
        city: property.city,
        type: property.type,
        area: property.area,
        propertyScore: propertyScore
      },
      loanOffers: loanOffers.slice(0, 10), // Limit to top 10 offers
      totalOffersAvailable: loanOffers.length,
      calculationDate: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating loan options",
      error: error.message
    });
  }
};

// Create new banking partner (Admin only)
const createBankingPartner = async (req, res) => {
  try {
    const partner = new BankingPartner(req.body);
    await partner.save();

    res.status(201).json({
      success: true,
      message: "Banking partner created successfully",
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating banking partner",
      error: error.message
    });
  }
};

// Update banking partner
const updateBankingPartner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await BankingPartner.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Banking partner not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Banking partner updated successfully",
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating banking partner",
      error: error.message
    });
  }
};

// Delete banking partner
const deleteBankingPartner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await BankingPartner.findByIdAndDelete(id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Banking partner not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Banking partner deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting banking partner",
      error: error.message
    });
  }
};

module.exports = {
  getAllBankingPartners,
  getBankingPartnerById,
  getLoanOptionsForProperty,
  createBankingPartner,
  updateBankingPartner,
  deleteBankingPartner
};