import React from "react";

const StaffVerifyProperties = ({
  properties,
  loading,
  error,
  handleAcceptProperty,
}) => {
  const styles = {
    containerStaff: {
      padding: 16,
    },
    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 10,
      marginBottom: 16,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    titleRow: {
      display: "flex",
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
      display: "block",
    },
    value: {
      marginBottom: 4,
      color: "#444",
      display: "block",
    },
    buttons: {
      marginTop: 12,
      display: "flex",
      justifyContent: "flex-start",
    },
    acceptBtn: {
      backgroundColor: "#4CAF50",
      padding: "8px 20px",
      borderRadius: 5,
      border: "none",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
    },
    message: {
      marginTop: 10,
      fontSize: 16,
    },
    error: {
      color: "red",
      fontSize: 16,
    },
  };

  return (
    <div style={styles.containerStaff}>
      {loading ? (
        <p style={styles.message}>Loading properties...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : properties.length === 0 ? (
        <p style={styles.message}>No properties pending verification.</p>
      ) : (
        properties.map((property) => (
          <div key={property._id} style={styles.card}>
            <div style={styles.titleRow}>
              <h2 style={styles.title}>{property.title}</h2>
              <span
                style={{
                  ...styles.status,
                  ...(property.verification === "pending"
                    ? styles.pending
                    : property.verification === "verified"
                    ? styles.verified
                    : styles.rejected),
                }}
              >
                {property.verification}
              </span>
            </div>

            <div style={styles.infoGroup}>
              <span style={styles.label}>Location:</span>
              <span style={styles.value}>
                {property.address}, {property.city}
              </span>

              <span style={styles.label}>BHK:</span>
              <span style={styles.value}>{property.Bhk}</span>

              <span style={styles.label}>Area:</span>
              <span style={styles.value}>{property.area} sq.ft</span>

              <span style={styles.label}>Type:</span>
              <span style={styles.value}>{property.type}</span>

              <span style={styles.label}>Purpose:</span>
              <span style={styles.value}>{property.purpose}</span>

              <span style={styles.label}>Price:</span>
              <span style={styles.value}>₹{property.price}</span>

              <span style={styles.label}>Description:</span>
              <span style={styles.value}>{property.description}</span>

              <span style={styles.label}>Amenities:</span>
              <span style={styles.value}>
                {property.amenities.join(", ")}
              </span>

              <span style={styles.label}>Balconies:</span>
              <span style={styles.value}>{property.balconies}</span>

              <span style={styles.label}>Bathrooms:</span>
              <span style={styles.value}>{property.bathrooms}</span>

              <span style={styles.label}>Floors:</span>
              <span style={styles.value}>{property.floors}</span>

              <span style={styles.label}>Owner:</span>
              <span style={styles.value}>
                {property.Propreiter_name} | {property.Propreiter_email} |{" "}
                {property.Propreiter_contact}
              </span>

              <span style={styles.label}>Submitted:</span>
              <span style={styles.value}>
                {new Date(property.created_at).toLocaleString()}
              </span>
            </div>

            {property.verification === "pending" && (
              <div style={styles.buttons}>
                <button
                  style={styles.acceptBtn}
                  onClick={() => handleAcceptProperty(property._id)}
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StaffVerifyProperties;