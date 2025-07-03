import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";

const StaffManagedAppointments = ({
  appointments,
  loading,
  staffId,
  error,
  handleCancelAppointment,
  handleAcceptAppointment,
  handleConfirmedAppointment,
  handleUpdateLog,
}) => {
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

  const renderAppointment = ({ item: a }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{`${a.firstName || ""} ${a.lastName || ""}`.trim() || "N/A"}</Text>
      <Text>Email: {a.email || "N/A"}</Text>
      <Text>Phone: {a.phoneNumber || "N/A"}</Text>
      <Text>Status: {a.status}</Text>
      <Text>
        Managed By: {a.staffId ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedStaff(a.staffId);
              setIsStaffModalOpen(true);
            }}>
            <Text style={styles.link}>{a.staffId.staffId}</Text>
          </TouchableOpacity>
        ) : (
          "—"
        )}
      </Text>
      <Text>Created: {new Date(a.createdAt).toLocaleString()}</Text>
      <Text>Updated: {new Date(a.updatedAt).toLocaleString()}</Text>
      <Text>
        Type: {a.isGuest ? (
          "Guest"
        ) : (
          <TouchableOpacity onPress={() => handleUserClick(a.userId)}>
            <Text style={styles.link}>User</Text>
          </TouchableOpacity>
        )}
      </Text>
      {a.status.toLowerCase() === "pending" ? (
        <View style={styles.actionsRow}>
          <Button title="Accept" onPress={() => handleAcceptAppointment(a._id)} color="#28a745" />
          <Button title="Reject" onPress={() => handleCancelAppointment(a._id)} color="#dc3545" />
        </View>
      ) : a.status.toLowerCase() !== "cancelled" ? (
        <Button
          title="Logs"
          onPress={() => {
            // navigate(`/staff/${staffId}/appointments/${a._id}/logs`);
            // Placeholder for navigation
            alert(`Navigate to logs for ${a._id}`);
          }}
          color="#007bff"
        />
      ) : (
        <Text>-</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <View style={styles.filterRow}>
            <TextInput
              placeholder="Search here..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
            <TextInput
              placeholder="Status"
              value={selectedStatus}
              onChangeText={setSelectedStatus}
              style={styles.statusFilter}
            />
          </View>

          {filteredAppointments.length > 0 ? (
            <FlatList
              data={filteredAppointments.reverse()}
              keyExtractor={(item) => item._id}
              renderItem={renderAppointment}
            />
          ) : (
            <Text>No appointments available.</Text>
          )}

          {/* User Modal */}
          <Modal visible={isModalOpen} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Button title="Close" onPress={closeModal} />
                {selectedUser && (
                  <>
                    <Text>User Details</Text>
                    <Text>Name: {selectedUser.firstName} {selectedUser.lastName}</Text>
                    <Text>Email: {selectedUser.email}</Text>
                    <Text>Phone: {selectedUser.phoneNumber}</Text>
                    <Text>Landline: {selectedUser.landlineNumber}</Text>
                    <Text>City: {selectedUser.city}</Text>
                    <Text>Address: {selectedUser.address}</Text>
                  </>
                )}
              </View>
            </View>
          </Modal>

          {/* Staff Modal */}
          <Modal visible={isStaffModalOpen} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Button title="Close" onPress={() => { setIsStaffModalOpen(false); setSelectedStaff(null); }} />
                {selectedStaff && (
                  <>
                    <Text>Staff Details</Text>
                    <Text>Staff ID: {selectedStaff.staffId}</Text>
                    <Text>Full Name: {selectedStaff.fullName}</Text>
                    <Text>Email: {selectedStaff.email}</Text>
                    <Text>Phone: {selectedStaff.phoneNumber}</Text>
                    <Text>Role: {selectedStaff.role}</Text>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStaffApp: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 90,
    flex: 1,
  },
  statusFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
    fontWeight: '500',
  },
  noAppointments: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  headApp: {
    marginVertical: 10,
    paddingHorizontal: 5,
    fontSize: 22,
    fontWeight: '700',
  },
  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    color: 'black',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  CancelBtn: {
    borderWidth: 1,
    borderColor: 'black',
    color: '#e74c3c',
    padding: 3,
    textAlign: 'center',
  },
  AcceptBtn: {
    borderWidth: 1,
    borderColor: 'black',
    color: '#bb8e06',
    padding: 3,
    textAlign: 'center',
  },
  LogBTNs: {
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    padding: 3,
    textAlign: 'center',
  },
  statusBTNs: {
    flexDirection: 'column',
    gap: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: 400,
    maxWidth: '90%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  closeModalBtn: {
    position: 'absolute',
    top: 8,
    right: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontSize: 22,
    borderRadius: 28,
  },
  userDetailsBtn: {
    borderRadius: 6,
    textDecorationLine: 'underline',
    color: 'darkblue',
    textAlign: 'center',
  },
});

export default StaffManagedAppointments;

