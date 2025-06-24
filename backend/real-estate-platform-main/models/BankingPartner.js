const mongoose = require("mongoose");

const bankingPartnerSchema = new mongoose.Schema(
  {
    bankId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    bankCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactDetails: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    loanProducts: [
      {
        productName: {
          type: String,
          required: true,
        },
        productType: {
          type: String,
          enum: ["home_loan", "plot_loan", "construction_loan", "top_up_loan"],
          required: true,
        },
        interestRate: {
          min: {
            type: Number,
            required: true,
          },
          max: {
            type: Number,
            required: true,
          },
        },
        processingFee: {
          percentage: {
            type: Number,
            default: 0,
          },
          fixedAmount: {
            type: Number,
            default: 0,
          },
          maxAmount: {
            type: Number,
          },
        },
        loanAmount: {
          min: {
            type: Number,
            required: true,
          },
          max: {
            type: Number,
            required: true,
          },
        },
        tenure: {
          min: {
            type: Number,
            required: true, // in years
          },
          max: {
            type: Number,
            required: true, // in years
          },
        },
        ltvRatio: {
          type: Number,
          required: true, // Loan to Value ratio (70-90%)
        },
        eligibilityCriteria: {
          minAge: {
            type: Number,
            default: 21,
          },
          maxAge: {
            type: Number,
            default: 65,
          },
          minIncome: {
            type: Number,
            required: true,
          },
          employmentType: [{
            type: String,
            enum: ["salaried", "self_employed", "business", "professional"],
          }],
          minCreditScore: {
            type: Number,
            default: 650,
          },
          workExperience: {
            type: Number,
            default: 2, // in years
          },
        },
        propertyTypes: [{
          type: String,
          enum: ["apartment", "villa", "plot", "commercial", "residential"],
        }],
        specialOffers: [{
          offerName: {
            type: String,
          },
          description: {
            type: String,
          },
          discountRate: {
            type: Number,
          },
          validTill: {
            type: Date,
          },
          conditions: {
            type: String,
          },
        }],
        features: [{
          type: String,
        }],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    partnershipDetails: {
      partnershipType: {
        type: String,
        enum: ["preferred", "standard", "premium"],
        default: "standard",
      },
      commissionRate: {
        type: Number,
        default: 0,
      },
      agreementStartDate: {
        type: Date,
        required: true,
      },
      agreementEndDate: {
        type: Date,
        required: true,
      },
      contactPerson: {
        name: {
          type: String,
          required: true,
        },
        designation: {
          type: String,
        },
        phone: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String, // URL to bank logo
    },
    website: {
      type: String,
    },
    branchLocations: [{
      branchName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      managerName: {
        type: String,
      },
      managerContact: {
        type: String,
      },
    }],
    preferredPropertyTypes: [{
      type: String,
      enum: ["apartment", "villa", "plot", "commercial", "residential"],
    }],
    preferredPropertyValueRange: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
bankingPartnerSchema.index({ bankId: 1 });
bankingPartnerSchema.index({ bankCode: 1 });
bankingPartnerSchema.index({ bankName: 1 });
bankingPartnerSchema.index({ isActive: 1 });
bankingPartnerSchema.index({ "partnershipDetails.partnershipType": 1 });
bankingPartnerSchema.index({ "loanProducts.productType": 1 });
bankingPartnerSchema.index({ "loanProducts.isActive": 1 });
bankingPartnerSchema.index({ rating: -1 });

const BankingPartner = mongoose.model("BankingPartner", bankingPartnerSchema);
module.exports = BankingPartner;