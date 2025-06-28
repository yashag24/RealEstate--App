import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const AdminList = ({ admins, onAddAdminClick, loading, error, handleRemoveAdmin }) => {
  const reversedAdmins = [...admins].reverse(); // To avoid mutating original array

  const renderAdminItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.adminId}</Text>
      <Text style={styles.cell}>{item.buyersId?.length ?? 0}</Text>
      <Text style={styles.cell}>{item.sellersId?.length ?? 0}</Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleRemoveAdmin(item._id)}
      >
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admins</Text>
        <TouchableOpacity onPress={onAddAdminClick} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Admin</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Admin ID</Text>
            <Text style={styles.headerCell}>Buyers</Text>
            <Text style={styles.headerCell}>Sellers</Text>
            <Text style={styles.headerCell}>Delete</Text>
          </View>
          <FlatList
            data={reversedAdmins}
            keyExtractor={(item) => item._id}
            renderItem={renderAdminItem}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  adminList: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4, // For Android shadow
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  headerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

  headerButtonPressed: {
    backgroundColor: '#0056b3',
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f4f4f4',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },

  tableRowAlt: {
    backgroundColor: '#fafafa',
  },

  tableCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },

  tableHeaderCell: {
    fontWeight: '600',
  },

  error: {
    color: 'red',
    fontWeight: '500',
    marginTop: 10,
  },
});


export default AdminList;
