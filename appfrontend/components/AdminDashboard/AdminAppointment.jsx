import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

const AdminAppointment = ({
  appointments,
  loading,
  error,
  handleRemoveAppointment,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState([]);

  const filteredAppointments = [...appointments]
    .reverse()
    .filter((a) => {
      const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const email = a.email.toLowerCase();
      const phone = a.phoneNumber.toLowerCase();
      const status = a.status.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return (
        (selectedStatus === "all" || status === selectedStatus.toLowerCase()) &&
        (fullName.includes(searchTermLower) ||
          email.includes(searchTermLower) ||
          phone.includes(searchTermLower))
      );
    });

  const openStaffModal = (staff) => {
    setSelectedStaff(staff);
    setShowStaffModal(true);
  };

  const openUpdateModal = (updates) => {
    setSelectedUpdates(updates);
    setShowUpdateModal(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{`${item.firstName || ""} ${item.lastName || ""}`}</Text>
      <Text style={styles.cell}>{item.email || "N/A"}</Text>
      <Text style={styles.cell}>{item.phoneNumber || "N/A"}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <TouchableOpacity
        onPress={() => openStaffModal(item.staffId)}
        disabled={!item.staffId}
      >
        <Text style={[styles.cell, styles.link]}>
          {item.staffId?.staffId || "N/A"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.cell}>
        {new Date(item.updatedAt).toLocaleString()}
        {"\n"}
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.cell}>{item.isGuest ? "Guest" : "User"}</Text>
      <View style={[styles.cell, { flexDirection: "row", gap: 12 }]}>
        <TouchableOpacity onPress={() => openUpdateModal(item.appointmentUpdates)}>
          <Icon name="info-circle" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveAppointment(item._id)}>
          <Icon name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Appointments</Text>

      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val)}
            style={styles.picker}
          >
            {["all", "Pending", "Accepted", "Scheduled", "In Progress", "Completed", "Cancelled"]
              .map((status) => (
                <Picker.Item label={status} value={status} key={status} />
              ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <Text style={styles.statusText}>Loading appointments...</Text>
      ) : error ? (
        <Text style={[styles.statusText, { color: "red" }]}>{error}</Text>
      ) : filteredAppointments.length === 0 ? (
        <Text style={styles.statusText}>No appointments found.</Text>
      ) : (
        <>
          <View style={styles.headerRow}>
            {["Name", "Email", "Phone", "Status", "Staff", "Timestamps", "Type", "Actions"].map(
              (h, i) => (
                <Text style={[styles.cell, styles.headerCell]} key={i}>{h}</Text>
              )
            )}
          </View>
          <FlatList
            data={filteredAppointments}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        </>
      )}

      {/* Staff Modal */}
      <Modal visible={showStaffModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selectedStaff ? (
              <>
                <Text style={styles.modalTitle}>Staff Details</Text>
                <Text>ID: {selectedStaff.staffId}</Text>
                <Text>Name: {selectedStaff.fullName}</Text>
                <Text>Email: {selectedStaff.email}</Text>
                <Text>Phone: {selectedStaff.phoneNumber}</Text>
                <Text>Role: {selectedStaff.role}</Text>
              </>
            ) : (
              <Text>No staff data available.</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStaffModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Update Modal */}
      <Modal visible={showUpdateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { maxHeight: "80%" }]}>
            <Text style={styles.modalTitle}>Appointment Updates</Text>
            {selectedUpdates.length > 0 ? (
              selectedUpdates.reverse().map((log, index) => (
                <View key={index} style={styles.updateItem}>
                  <Text>{`#${index + 1} - ${log.status}`}</Text>
                  <Text>{`Type: ${log.appointmentType}`}</Text>
                  <Text>{`Note: ${log.note}`}</Text>
                  <Text>{`Staff ID: ${log.staffId}`}</Text>
                  <Text>{`Follow-up: ${new Date(log.followUpDate).toLocaleDateString()}`}</Text>
                  <Text>{`Updated At: ${new Date(log.updatedAt).toLocaleString()}`}</Text>
                </View>
              ))
            ) : (
              <Text>No updates found.</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUpdateModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminAppointment;

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  pickerWrapper: {
    width: 160,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: { height: 40 },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  headerCell: { fontWeight: "bold" },
  link: { color: "#007bff", textDecorationLine: "underline" },
  statusText: { textAlign: "center", marginTop: 20, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 6,
  },
  closeButtonText: { color: "white", textAlign: "center" },
  updateItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
});
