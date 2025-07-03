// LoanSection.js
import React from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");

export const LoanSection = ({
  
  showLoanOffers,
  setShowLoanOffers,
  selectedLoanAmount,
  setSelectedLoanAmount,
  monthlyIncome,
  setMonthlyIncome,
  handleLoanFilterChange,
  loadingLoanOffers,
  loanOffers,
  formatCurrency,
}) => (
  <View style={styles.section}>
    <View style={styles.bankingSectionHeader}>
      <Text style={styles.sectionTitle}>🏦 Loan Options Available</Text>
      {showLoanOffers && (
        <Pressable
          style={styles.closeButton}
          onPress={() => setShowLoanOffers(false)}
        >
          <View style={styles.closeButtonCircle}>
            <Text style={styles.closeButtonText}>×</Text>
          </View>
        </Pressable>
      )}
    </View>
    {!showLoanOffers ? (
      <Pressable
        style={styles.showLoanOffersButton}
        onPress={() => setShowLoanOffers(true)}
      >
        <Text style={styles.showLoanOffersButtonText}>
          Show Loan Offers
        </Text>
      </Pressable>
    ) : (
      <View style={{ position: "relative" }}>
        {/* Loan Offers Content */}
        <View>
          <View style={styles.loanFilterContainer}>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Desired loan amount"
                value={selectedLoanAmount}
                onChangeText={setSelectedLoanAmount}
                keyboardType="numeric"
                style={styles.loanInput}
              />
              <TextInput
                placeholder="Monthly income"
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                keyboardType="numeric"
                style={styles.loanInput}
              />
            </View>
            <Pressable
              onPress={handleLoanFilterChange}
              style={styles.filterButton}
            >
              <Text style={styles.filterButtonText}>
                Get Personalized Offers
              </Text>
            </Pressable>
          </View>
          {loadingLoanOffers ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading loan offers...</Text>
            </View>
          ) : loanOffers.length > 0 ? (
            <View style={styles.loanOffersContainer}>
              <Text style={styles.offersCountText}>
                {loanOffers.length} loan offers available
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.offersScrollViewHorizontal}
                contentContainerStyle={styles.offersScrollContent}
              >
                {loanOffers.map((offer, index) => (
                  <View key={index} style={styles.loanOfferCardHorizontal}>
                    <View style={styles.bankHeader}>
                      <Text style={styles.bankName}>{offer.bankName}</Text>
                      <View style={styles.ratingBadge}>
                        <Text style={styles.starRating}>★</Text>
                        <Text style={styles.ratingText}>
                          {offer.bankRating}/5
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.productName}>
                      {offer.productName} -{" "}
                      {offer.productType.replace("_", " ").toUpperCase()}
                    </Text>
                    <View style={styles.offerDetailsGrid}>
                      <View style={styles.offerDetailItem}>
                        <Text style={styles.offerDetailLabel}>
                          Max Loan Amount
                        </Text>
                        <Text style={styles.offerDetailValue}>
                          {formatCurrency(offer.maxLoanAmount)}
                        </Text>
                      </View>
                      <View style={styles.offerDetailItem}>
                        <Text style={styles.offerDetailLabel}>
                          Interest Rate
                        </Text>
                        <Text style={styles.offerDetailValue}>
                          {offer.interestRate}% p.a.
                        </Text>
                      </View>
                    </View>
                    {offer.emiOptions && offer.emiOptions.length > 0 && (
                      <View style={styles.emiOptionsContainer}>
                        <Text style={styles.emiOptionsLabel}>
                          EMI Options
                        </Text>
                        <View style={styles.emiOptionsGrid}>
                          {offer.emiOptions
                            .slice(0, 2)
                            .map((emi, emiIndex) => (
                              <View key={emiIndex} style={styles.emiOption}>
                                <Text style={styles.emiText}>
                                  {emi.tenure}yr: {formatCurrency(emi.emi)}
                                  /mo
                                </Text>
                              </View>
                            ))}
                        </View>
                      </View>
                    )}
                    {offer.processingFee > 0 && (
                      <Text style={styles.processingFeeText}>
                        Processing Fee:{" "}
                        {formatCurrency(offer.processingFee)}
                      </Text>
                    )}
                    {offer.specialOffers &&
                      offer.specialOffers.length > 0 && (
                        <View style={styles.specialOfferContainer}>
                          <Text style={styles.specialOfferText}>
                            🎉 {offer.specialOffers[0].offerName}:{" "}
                            {offer.specialOffers[0].description}
                          </Text>
                        </View>
                      )}
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.noOffersContainer}>
              <Text style={styles.noOffersIcon}>🏦</Text>
              <Text style={styles.noOffersText}>
                No loan offers available for this property at the moment.
              </Text>
            </View>
          )}
        </View>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 10,
  },
  bankingSectionHeader: {
    marginBottom: 20,
  },
  showLoanOffersButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 300,
    minWidth: 180,
    alignSelf: "center",
  },
  showLoanOffersButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#64748b",
    fontWeight: "300",
    lineHeight: 20,
  },
  loanFilterContainer: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  loanInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },
  filterButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loanOffersContainer: {
    flex: 1,
  },
  offersCountText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    fontWeight: "500",
  },
  offersScrollViewHorizontal: {
    paddingVertical: 8,
  },
  offersScrollContent: {
    paddingLeft: 4,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "stretch",
  },
  loanOfferCardHorizontal: {
    width: screenWidth * 0.75,
    marginRight: 16,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  bankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starRating: {
    color: "#f59e0b",
    fontSize: 14,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#92400e",
    fontWeight: "600",
  },
  productName: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    fontWeight: "500",
  },
  offerDetailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  offerDetailItem: {
    flex: 1,
  },
  offerDetailLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
    fontWeight: "500",
  },
  offerDetailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  emiOptionsContainer: {
    marginBottom: 12,
  },
  emiOptionsLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8,
    fontWeight: "500",
  },
  emiOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emiOption: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  emiText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "600",
  },
  processingFeeText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  specialOfferContainer: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  specialOfferText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  noOffersContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noOffersIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noOffersText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
