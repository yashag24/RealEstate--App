import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Ionicons,
} from "react-native";
import {
  FontAwesome5,
  // Ionicons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const ContractorServices = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/contractor/verified`);
        setContractors(res.data);
      } catch (error) {
        console.error("Error fetching contractors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  return (
    <ScrollView style={styles.container}>
    

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "left",
        padding: 0,
        marginTop: 0,
        marginLeft: 0,
        alignSelf: "flex-start",
      }}
      onPress={() => router.back()}
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color="#667eea" />
      {/* <Text style={{ color: "#667eea", fontSize: 16, marginLeft: 6, fontWeight: "600" }}>
        Back
      </Text> */}
    </TouchableOpacity>
        <Text style={styles.heading}>Verified Contractor Services</Text>
        <Text style={styles.tagline}>
          Hire trusted professionals for repairs, renovations, and civil work.
        </Text>
      </View>

      {/* Contractor List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Verified Contractors</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#667eea"
            style={styles.loading}
          />
        ) : contractors.length === 0 ? (
          <Text style={styles.noContractors}>
            No contractors available at the moment.
          </Text>
        ) : (
          <View style={styles.contractorGrid}>
            {contractors.map((contractor) => (
              <TouchableOpacity
                key={contractor._id}
                style={styles.contractorCard}
                onPress={() =>
                  router.push(`/services/contractors/${contractor._id}`)
                }
              >
                <Text style={styles.contractorName}>{contractor.name}</Text>
                <View style={styles.infoRow}>
                  <Feather name="map-pin" size={16} color="#764ba2" />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Location: </Text>
                    {contractor.location}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="tool" size={16} color="#764ba2" />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Service Type: </Text>
                    {contractor.serviceType}
                  </Text>
                </View>
                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>Contracts Completed: </Text>
                  {contractor.portfolio.length}
                </Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="#059669" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Features Section */}
      <View style={styles.gridSection}>
        <View style={styles.featureCard}>
          <FontAwesome5 name="hard-hat" size={32} color="#667eea" />
          <Text style={styles.featureTitle}>Civil Work</Text>
          <Text style={styles.featureText}>
            Expert support for structural repairs, tiling, plastering, and home
            expansion.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <FontAwesome5 name="drafting-compass" size={32} color="#667eea" />
          <Text style={styles.featureTitle}>Interior Renovation</Text>
          <Text style={styles.featureText}>
            Skilled professionals for carpentry, painting, plumbing, and design
            upgrades.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <FontAwesome5 name="wrench" size={32} color="#667eea" />
          <Text style={styles.featureTitle}>On-Demand Repairs</Text>
          <Text style={styles.featureText}>
            Quick fixes for leakages, electric faults, and minor construction
            defects.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Feather name="clock" size={32} color="#667eea" />
          <Text style={styles.featureTitle}>Time-Bound Delivery</Text>
          <Text style={styles.featureText}>
            All work delivered within committed timelines by verified
            contractors.
          </Text>
        </View>
      </View>

      {/* Highlights Section */}
      <View style={styles.highlights}>
        <Text style={styles.highlightsTitle}>Why Hire Through Us?</Text>
        <View style={styles.highlightsList}>
          <View style={styles.highlightItem}>
            <MaterialIcons name="check-circle" size={20} color="#059669" />
            <Text style={styles.highlightText}>
              Vetted contractors with proven experience
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <MaterialIcons name="check-circle" size={20} color="#059669" />
            <Text style={styles.highlightText}>
              Transparent pricing and timelines
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <MaterialIcons name="check-circle" size={20} color="#059669" />
            <Text style={styles.highlightText}>
              Support for residential and commercial needs
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <MaterialIcons name="check-circle" size={20} color="#059669" />
            <Text style={styles.highlightText}>
              Real-time work tracking and updates
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  heroSection: {
    padding: 24,
    margin: 16,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderBottomWidth: 4,
    borderBottomColor: "#667eea",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    color: "#667eea",
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: "#1f2937",
    textAlign: "center",
    textTransform: "uppercase",
  },
  loading: {
    marginVertical: 40,
  },
  noContractors: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginVertical: 20,
  },
  contractorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contractorCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#667eea",
  },
  contractorName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1f2937",
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  infoLabel: {
    color: "#1f2937",
    fontWeight: "600",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignSelf: "center",
    marginTop: 12,
  },
  verifiedText: {
    color: "#059669",
    fontWeight: "600",
    marginLeft: 4,
    fontSize: 14,
  },
  gridSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 8,
    color: "#1f2937",
    textAlign: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  highlights: {
    backgroundColor: "#ecfdf5",
    padding: 24,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  highlightsTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
    color: "#667eea",
    textAlign: "center",
    textTransform: "uppercase",
  },
  highlightsList: {
    marginTop: 8,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  highlightText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ContractorServices;
