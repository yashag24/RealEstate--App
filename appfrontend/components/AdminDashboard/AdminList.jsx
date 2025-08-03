// AdminList.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

const AdminList = ({ admins, onAddAdminClick, handleRemoveAdmin, loading, error, refreshAdmins }) => {
  const confirmDelete = async (adminId) => {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Are you sure you want to delete this admin?');
      if (ok) {
        await handleRemoveAdmin(adminId);
        refreshAdmins();
      }
    } else {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this admin?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await handleRemoveAdmin(adminId);
              refreshAdmins();
            }
          },
        ]
      );
    }
  };

  const renderAdminItem = ({ item, index }) => (
    <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}>
      <Text style={styles.tableCell}>{item.adminId || "N/A"}</Text>
      <Text style={[styles.tableCell, styles.tableCellNumber]}>{item.fullName}</Text>
      <Text style={[styles.tableCell, styles.tableCellNumber]}>{item.email}</Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => confirmDelete(item._id)}
        disabled={loading}
      >
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.adminList}>
      <View style={styles.header}>
        <Text style={styles.title}>Admins</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={refreshAdmins}
            disabled={loading}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddAdminClick}
            disabled={loading}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading admins...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Admin ID</Text>
            <Text style={styles.tableHeaderCell}>Name</Text>
            <Text style={styles.tableHeaderCell}>Email</Text>
            <Text style={styles.tableHeaderCell}>Delete</Text>
          </View>
          <FlatList
            data={admins}
            renderItem={renderAdminItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No admins found</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  adminList: { flex: 1, padding: 16, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#2c3e50" },
  headerButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  refreshButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 25 },
  refreshButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  addButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 25 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 18, color: "#6c757d" },
  errorContainer: { padding: 20, alignItems: "center" },
  errorText: { color: "#dc3545", fontSize: 18, marginBottom: 16 },
  table: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#343a40",
    padding: 16,
  },
  tableHeaderCell: {
    flex: 1,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e9ecef",
  },
  tableRowEven: { backgroundColor: "#f8f9fa" },
  tableCell: { flex: 1, textAlign: "center", fontSize: 16, color: "#495057" },
  tableCellNumber: { fontSize: 18, fontWeight: "600", color: "#007bff" },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  deleteBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  emptyState: { padding: 40, alignItems: "center" },
  emptyStateText: { fontSize: 18, color: "#6c757d", marginBottom: 16 },
});

export default AdminList;
