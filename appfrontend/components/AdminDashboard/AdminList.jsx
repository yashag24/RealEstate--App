import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

const AdminList = ({ onAddAdminClick }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace this URL with your actual API endpoint
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Fetch admins from the API
  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assuming the API returns an array of admins or { admins: [...] }
      const adminList = Array.isArray(data) ? data : data.admins || [];
      setAdmins(adminList);
      
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError(`Failed to load admins: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove admin function
  const handleRemoveAdmin = async (adminId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this admin?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              
              const response = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  // Add authorization header if needed
                  // 'Authorization': `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              // Remove the admin from local state
              setAdmins(prevAdmins => 
                prevAdmins.filter(admin => admin._id !== adminId)
              );
              
              Alert.alert("Success", "Admin deleted successfully");
              
            } catch (err) {
              console.error('Error deleting admin:', err);
              Alert.alert("Error", `Failed to delete admin: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Fetch admins when component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Refresh function
  const handleRefresh = () => {
    fetchAdmins();
  };

  const renderAdminItem = ({ item: admin, index }) => (
    <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}>
      <Text style={styles.tableCell}>{admin.adminId || 'N/A'}</Text>
      <Text style={[styles.tableCell, styles.tableCellNumber]}>
        {admin.buyersId?.length ?? 0}
      </Text>
      <Text style={[styles.tableCell, styles.tableCellNumber]}>
        {admin.sellersId?.length ?? 0}
      </Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleRemoveAdmin(admin._id)}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderCell}>Admin ID</Text>
      <Text style={styles.tableHeaderCell}>Buyers</Text>
      <Text style={styles.tableHeaderCell}>Sellers</Text>
      <Text style={styles.tableHeaderCell}>Delete Account</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No admins found</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.adminList}>
      <View style={styles.header}>
        <Text style={styles.title}>Admins</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={handleRefresh}
            disabled={loading}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={onAddAdminClick}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>Add Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading admins...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.table}>
          {renderHeader()}
          <FlatList
            data={admins} // Removed .reverse() - better to handle sorting on backend
            renderItem={renderAdminItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            refreshing={loading}
            onRefresh={handleRefresh}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  adminList: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 8,
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  error: {
    color: '#dc3545',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
  },
  table: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#343a40',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#495057',
    fontWeight: '500',
  },
  tableCellNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default AdminList;