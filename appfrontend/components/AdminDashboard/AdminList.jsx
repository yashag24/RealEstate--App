import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const AdminList = ({ 
  admins, 
  onAddAdminClick, 
  loading, 
  error, 
  handleRemoveAdmin 
}) => {
  const reversedAdmins = [...admins].reverse(); // To avoid mutating original array

  const renderAdminItem = ({ item, index }) => (
    <View style={[styles.adminCard, index % 2 === 0 ? styles.evenCard : styles.oddCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.adminId}>{item.adminId}</Text>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.buyersId?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Buyers</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.sellersId?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Sellers</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {(item.buyersId?.length ?? 0) + (item.sellersId?.length ?? 0)}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleRemoveAdmin(item._id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteBtnText}>Remove Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading admins...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryBtn}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Admin Management</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>
              Total Admins: {admins.length}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={onAddAdminClick} 
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add Admin</Text>
        </TouchableOpacity>
      </View>

      {admins.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>👥</Text>
          <Text style={styles.emptyStateText}>No admins found</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first admin to get started
          </Text>
          <TouchableOpacity 
            onPress={onAddAdminClick} 
            style={styles.emptyStateButton}
          >
            <Text style={styles.emptyStateButtonText}>Add First Admin</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reversedAdmins}
          keyExtractor={(item) => item._id}
          renderItem={renderAdminItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },

  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  listContainer: {
    padding: 16,
  },

  adminCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  evenCard: {
    backgroundColor: '#ffffff',
  },

  oddCard: {
    backgroundColor: '#fafbfc',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  adminId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
  },

  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },

  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  deleteBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },

  retryBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },

  emptyStateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AdminList;