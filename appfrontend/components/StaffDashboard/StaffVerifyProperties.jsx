import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.message}>Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={[styles.message, styles.error]}>{error}</Text>
      </View>
    );
  }

  if (properties.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>No properties pending verification.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            <LabelValue label="Location" value={`${property.address}, ${property.city}`} />
            <LabelValue label="BHK" value={property.Bhk} />
            <LabelValue label="Area" value={`${property.area} sq.ft`} />
            <LabelValue label="Type" value={property.type} />
            <LabelValue label="Purpose" value={property.purpose} />
            <LabelValue label="Price" value={`₹${property.price}`} />
            <LabelValue label="Description" value={property.description} />
            <LabelValue label="Amenities" value={property.amenities.join(", ")} />
            <LabelValue label="Balconies" value={property.balconies.toString()} />
            <LabelValue label="Bathrooms" value={property.bathrooms.toString()} />
            <LabelValue label="Floors" value={property.floors} />
            <LabelValue
              label="Owner"
              value={`${property.Propreiter_name} | ${property.Propreiter_email} | ${property.Propreiter_contact}`}
            />
            <LabelValue
              label="Submitted"
              value={new Date(property.created_at).toLocaleString()}
            />
          </View>

          {property.verification === "pending" && (
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => handleAcceptProperty(property._id)}
            >
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const LabelValue = ({ label, value }) => (
  <View style={styles.labelValueRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  containerStaff: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    padding: 24,
    justifyContent: 'center',
    marginTop: 70,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 35,
    width: '100%',
    maxWidth: 550,
    flexGrow: 1,
    flexShrink: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2a2a2a',
    flexShrink: 1,
    marginRight: 10,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    textTransform: 'uppercase',
    color: '#fff',
  },
  pending: {
    backgroundColor: '#f0ad4e',
  },
  verified: {
    backgroundColor: '#28a745',
  },
  rejected: {
    backgroundColor: '#dc3545',
  },
  infoGroup: {
    flexDirection: 'column',
    rowGap: 12,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  value: {
    color: '#222',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 16,
    width: '100%',
  },
  acceptBtn: {
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: '80%',
  },
  message: {
    textAlign: 'center',
    marginVertical: 40,
    fontSize: 26,
    fontWeight: '600',
    color: '#555',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginVertical: 12,
  },
});


export default StaffVerifyProperties;

