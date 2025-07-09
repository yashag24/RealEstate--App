import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const AdminEnquiries = ({ enquiries, onDeleteEnquiry }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const renderEnquiryItem = ({ item }) => (
    <View style={styles.enquiryCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.fullName}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.isGuest ? 'Guest' : 'User'}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{item.phoneNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Message:</Text>
          <Text style={styles.messageValue} numberOfLines={2}>
            {item.messageEn}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Property:</Text>
          <TouchableOpacity
            onPress={() => setSelectedProperty(item.propertyId)}
            style={styles.propertyLink}>
            <Text style={styles.linkText}>
              {item.propertyId?.title || 'N/A'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          onPress={() => setSelectedEnquiry(item)}
          style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onDeleteEnquiry?.(item._id)}
          style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Enquiries Management</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>
            Total: {enquiries.length} enquiries
          </Text>
        </View>
      </View>

      {enquiries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No enquiries found</Text>
          <Text style={styles.emptyStateSubtext}>
            Customer enquiries will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={enquiries}
          renderItem={renderEnquiryItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Property Modal */}
      <Modal visible={!!selectedProperty} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Property Details</Text>
              <TouchableOpacity
                onPress={() => setSelectedProperty(null)}
                style={styles.closeBtn}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedProperty && (
                <View style={styles.propertyDetails}>
                  <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                  
                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{selectedProperty.city}</Text>
                    <Text style={styles.detailSubValue}>{selectedProperty.address}</Text>
                  </View>

                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Owner Information</Text>
                    <Text style={styles.detailValue}>{selectedProperty.Propreiter_name}</Text>
                    <Text style={styles.detailSubValue}>{selectedProperty.Propreiter_contact}</Text>
                    <Text style={styles.detailSubValue}>{selectedProperty.Propreiter_email}</Text>
                  </View>

                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Property Type</Text>
                    <Text style={styles.detailValue}>{selectedProperty.purpose}</Text>
                    <Text style={styles.detailSubValue}>{selectedProperty.type}</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Enquiry Modal */}
      <Modal visible={!!selectedEnquiry} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Information</Text>
              <TouchableOpacity
                onPress={() => setSelectedEnquiry(null)}
                style={styles.closeBtn}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedEnquiry?.userId && !selectedEnquiry.isGuest && (
                <View style={styles.userDetails}>
                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Full Name</Text>
                    <Text style={styles.detailValue}>
                      {selectedEnquiry.userId.firstName} {selectedEnquiry.userId.lastName}
                    </Text>
                  </View>

                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Contact Information</Text>
                    <Text style={styles.detailValue}>{selectedEnquiry.userId.email}</Text>
                    <Text style={styles.detailSubValue}>{selectedEnquiry.userId.phoneNumber}</Text>
                  </View>

                  <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Address</Text>
                    <Text style={styles.detailValue}>{selectedEnquiry.userId.city}</Text>
                    <Text style={styles.detailSubValue}>{selectedEnquiry.userId.address}</Text>
                    <Text style={styles.detailSubValue}>{selectedEnquiry.userId.state}</Text>
                  </View>
                </View>
              )}

              {selectedEnquiry?.isGuest && (
                <View style={styles.guestMessage}>
                  <Text style={styles.guestMessageText}>
                    This enquiry was submitted by a guest user.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },

  heading: {
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

  listContainer: {
    padding: 16,
  },

  enquiryCard: {
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

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
  },

  statusBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0288d1',
  },

  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    width: 80,
    marginRight: 12,
  },

  value: {
    fontSize: 14,
    color: '#1a202c',
    flex: 1,
  },

  messageValue: {
    fontSize: 14,
    color: '#1a202c',
    flex: 1,
    lineHeight: 20,
  },

  propertyLink: {
    flex: 1,
  },

  linkText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  viewBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },

  viewBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },

  deleteBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a202c',
  },

  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },

  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  propertyDetails: {
    marginBottom: 16,
  },

  propertyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 20,
  },

  detailGroup: {
    marginBottom: 20,
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  detailValue: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '500',
    marginBottom: 4,
  },

  detailSubValue: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },

  userDetails: {
    marginBottom: 16,
  },

  guestMessage: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },

  guestMessageText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
  },
});

export default AdminEnquiries;