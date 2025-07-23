import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const StaffVerifyProperties = ({
  properties,
  loading,
  error,
  handleAcceptProperty,
}) => {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4B9CD3" />
        <Text style={styles.message}>Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (properties.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No properties pending verification.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {properties.map((property) => (
        <View key={property._id} style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{property.title}</Text>
            <Text
              style={[
                styles.status,
                property.verification === "pending"
                  ? styles.pending
                  : property.verification === "verified"
                  ? styles.verified
                  : styles.rejected,
              ]}
            >
              {property.verification}
            </Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>
              {property.address}, {property.city}
            </Text>

            <Text style={styles.label}>BHK:</Text>
            <Text style={styles.value}>{property.Bhk}</Text>

            <Text style={styles.label}>Area:</Text>
            <Text style={styles.value}>{property.area} sq.ft</Text>

            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{property.type}</Text>

            <Text style={styles.label}>Purpose:</Text>
            <Text style={styles.value}>{property.purpose}</Text>

            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>₹{property.price}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{property.description}</Text>

            <Text style={styles.label}>Amenities:</Text>
            <Text style={styles.value}>{property.amenities.join(", ")}</Text>

            <Text style={styles.label}>Balconies:</Text>
            <Text style={styles.value}>{property.balconies}</Text>

            <Text style={styles.label}>Bathrooms:</Text>
            <Text style={styles.value}>{property.bathrooms}</Text>

            <Text style={styles.label}>Floors:</Text>
            <Text style={styles.value}>{property.floors}</Text>

            <Text style={styles.label}>Owner:</Text>
            <Text style={styles.value}>
              {property.Propreiter_name} | {property.Propreiter_email} |{" "}
              {property.Propreiter_contact}
            </Text>

            <Text style={styles.label}>Submitted:</Text>
            <Text style={styles.value}>
              {new Date(property.created_at).toLocaleString()}
            </Text>
          </View>

          {property.verification === "pending" && (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAcceptProperty(property._id)}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  pending: {
    color: "orange",
  },
  verified: {
    color: "green",
  },
  rejected: {
    color: "red",
  },
  infoGroup: {
    marginTop: 10,
  },
  label: {
    fontWeight: "600",
    marginTop: 6,
  },
  value: {
    marginBottom: 4,
    color: "#444",
  },
  buttons: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  acceptBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    padding: 20,
    alignItems: "center",
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});

export default StaffVerifyProperties;
