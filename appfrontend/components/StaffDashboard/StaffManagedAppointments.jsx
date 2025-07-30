import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StaffManagedAppointments = ({
  appointments,
  loading,
  staffId,
  error,
  handleCancelAppointment,
  handleAcceptAppointment,
}) => {
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus =
      selectedStatus === "All" ||
      a.status.toLowerCase() === selectedStatus.toLowerCase();

    const fullName = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
    const email = (a.email || "").toLowerCase();
    const phone = (a.phoneNumber || "").toLowerCase();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text numberOfLines={1}>
          {`${item.firstName || ""} ${item.lastName || ""}`.trim() || "N/A"}
        </Text>
      </View>
      <View style={styles.cell}>
        <Text numberOfLines={1}>{item.email || "N/A"}</Text>
      </View>
      <View style={styles.cell}>
        <Text>{item.phoneNumber || "N/A"}</Text>
      </View>
      <View style={styles.cell}>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cell}>
        {item.staffId ? (
          <Pressable
            onPress={() => {
              setSelectedStaff(item.staffId);
              setIsStaffModalOpen(true);
            }}
            style={styles.detailButton}
          >
            <Text style={styles.detailButtonText}>{item.staffId.staffId}</Text>
          </Pressable>
        ) : (
          <Text>—</Text>
        )}
      </View>
      <View style={styles.cell}>
        <Text numberOfLines={1}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.cell}>
        <Text numberOfLines={1}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.cell}>
        {item.isGuest ? (
          <Text>Guest</Text>
        ) : (
          <Pressable
            onPress={() => handleUserClick(item.userId)}
            style={styles.detailButton}
          >
            <Text style={styles.detailButtonText}>User</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.cell}>
        {item.status.toLowerCase() === "pending" ? (
          <View style={styles.actionButtons}>
            <Pressable
              onPress={() => handleAcceptAppointment(item._id)}
              style={[styles.button, styles.acceptButton]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </Pressable>
            <Pressable
              onPress={() => handleCancelAppointment(item._id)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </Pressable>
          </View>
        ) : item.status.toLowerCase() !== "cancelled" ? (
          <Pressable
            style={[styles.button, styles.logButton]}
            onPress={() =>
              navigation.navigate('AppointmentLogs', { 
                appointmentId: item._id,
                staffId: staffId
              })
            }
          >
            <Text style={styles.buttonText}>Logs</Text>
          </Pressable>
        ) : (
          <Text>-</Text>
        )}
      </View>
    </View>
  );

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { backgroundColor: '#f59e0b' };
      case 'accepted':
        return { backgroundColor: '#3b82f6' };
      case 'scheduled':
        return { backgroundColor: '#8b5cf6' };
      case 'in progress':
        return { backgroundColor: '#06b6d4' };
      case 'completed':
        return { backgroundColor: '#10b981' };
      case 'cancelled':
        return { backgroundColor: '#ef4444' };
      default:
        return { backgroundColor: '#64748b' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <View style={styles.controls}>
          <View style={styles.searchContainer}>
            <FontAwesome5 name="search" size={16} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search appointments..."
              placeholderTextColor="#94a3b8"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <View style={styles.filterContainer}>
            <FontAwesome5 name="filter" size={16} color="#64748b" />
            <Pressable
              style={styles.filterButton}
              onPress={() => {
                // In a real app, you'd use a proper picker component here
                const statuses = ['All', 'Pending', 'Accepted', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
                const currentIndex = statuses.indexOf(selectedStatus);
                const nextIndex = (currentIndex + 1) % statuses.length;
                setSelectedStatus(statuses[nextIndex]);
              }}
            >
              <Text style={styles.filterText}>{selectedStatus}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {filteredAppointments.length > 0 ? (
        <ScrollView horizontal={true}>
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>Full Name</Text>
              <Text style={styles.headerCell}>Email</Text>
              <Text style={styles.headerCell}>Phone</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Managed By</Text>
              <Text style={styles.headerCell}>Created</Text>
              <Text style={styles.headerCell}>Updated</Text>
              <Text style={styles.headerCell}>Type</Text>
              <Text style={styles.headerCell}>Action</Text>
            </View>
            <FlatList
              data={filteredAppointments}
              renderItem={renderAppointmentItem}
              keyExtractor={(item) => item._id}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="calendar-times" size={40} color="#94a3b8" />
          <Text style={styles.emptyText}>No appointments available</Text>
          <Text style={styles.emptySubtext}>Try changing your filters</Text>
        </View>
      )}

      {/* User Details Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <FontAwesome5 name="times" size={20} color="#64748b" />
            </Pressable>
            <Text style={styles.modalTitle}>User Details</Text>
            {selectedUser && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{selectedUser.phoneNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Landline:</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.landlineNumber || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>City:</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.city || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address:</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.address || 'N/A'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Staff Details Modal */}
      <Modal
        visible={isStaffModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsStaffModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable 
              style={styles.closeButton} 
              onPress={() => setIsStaffModalOpen(false)}
            >
              <FontAwesome5 name="times" size={20} color="#64748b" />
            </Pressable>
            <Text style={styles.modalTitle}>Staff Details</Text>
            {selectedStaff && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Staff ID:</Text>
                  <Text style={styles.detailValue}>{selectedStaff.staffId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Full Name:</Text>
                  <Text style={styles.detailValue}>{selectedStaff.fullName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedStaff.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{selectedStaff.phoneNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Role:</Text>
                  <Text style={styles.detailValue}>{selectedStaff.role}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  filterText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    width: 120,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cell: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  detailButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  detailButtonText: {
    color: '#3b82f6',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  logButton: {
    backgroundColor: '#3b82f6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#1e293b',
    width: 100,
  },
  detailValue: {
    flex: 1,
    color: '#64748b',
  },
});

export default StaffManagedAppointments;