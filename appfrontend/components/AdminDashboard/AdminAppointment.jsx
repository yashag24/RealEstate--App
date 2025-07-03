import React, { useState } from "react";
import { Modal ,StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  return (
    <div className={styles.container}>
      {loading ? (
        <p className={styles.loading}>Loading appointments...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.tableWrapper}>
          <div className={styles.headerRow}>
            <p className={styles.headApp}>Appointments</p>
            <div style={{ width: "30%", display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search here..."
                className={styles.searchInput}
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.dropdown}
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredAppointments.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Managed By</th>
                  <th>Updated / Created</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      {`${a.firstName || ""} ${a.lastName || ""}`.trim() ||
                        "N/A"}
                    </td>
                    <td>{a.email || "N/A"}</td>
                    <td>{a.phoneNumber || "N/A"}</td>
                    <td>
                      <span className={styles.status}>{a.status}</span>
                    </td>
                    <td>
                      <button
                        className={styles.linkBtn}
                        onClick={() => openStaffModal(a.staffId)}
                        disabled={!a.staffId}
                      >
                        {a.staffId?.staffId || "N/A"}
                      </button>
                    </td>
                    <td>
                      {new Date(a.updatedAt).toLocaleString()}
                      <hr />
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td>{a.isGuest ? "Guest" : "User"}</td>
                    <td>
                      <p
                        onClick={() => openUpdateModal(a.appointmentUpdates)}
                        className={styles.detailsBtn}
                        title="Details"
                      >
                        <Icon />
                      </p>
                      <button
                        onClick={() => handleRemoveAppointment(a._id)}
                        className={styles.deleteBtn}
                        title="Delete"
                      >
                        <Icon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noAppointments}>
              No appointments found for selected status.
            </p>
          )}
        </div>
      )}

      {/* Staff Modal */}
      <Modal
        isOpen={showStaffModal}
        onRequestClose={() => setShowStaffModal(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        {selectedStaff ? (
          <>
            <h2>Staff Details</h2>
            <p>
              <strong>ID:</strong> {selectedStaff.staffId}
            </p>
            <p>
              <strong>Name:</strong> {selectedStaff.fullName}
            </p>
            <p>
              <strong>Email:</strong> {selectedStaff.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedStaff.phoneNumber}
            </p>
            <p>
              <strong>Role:</strong> {selectedStaff.role}
            </p>
          </>
        ) : (
          <p>No staff data available.</p>
        )}
        <button
          onClick={() => setShowStaffModal(false)}
          className={styles.closeBtn}
        >
          Close
        </button>
      </Modal>

      {/* Appointment Updates Modal */}
      <Modal
        isOpen={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
        className={styles.largeModal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalHeader}>
          <h2>Appointment Updates</h2>
          <button
            onClick={() => setShowUpdateModal(false)}
            className={styles.closeBtn}
          >
            X
          </button>
        </div>

        {selectedUpdates?.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.updateTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Staff ID</th>
                  <th>Follow-up Date</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {selectedUpdates.reverse().map((log, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{log.status}</td>
                    <td>{log.appointmentType}</td>
                    <td>{log.note}</td>
                    <td>{log.staffId}</td>
                    <td>{new Date(log.followUpDate).toLocaleDateString()}</td>
                    <td>{new Date(log.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No updates found.</p>
        )}
      </Modal>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
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
  tableWrapper: {
    width: '100%',
  },
  headApp: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'left',
    paddingHorizontal: 5,
    fontSize: 22,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdown: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
  },
  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: '500',
    color: 'black',
  },
  pending: {
    backgroundColor: '#f39c12',
  },
  confirmed: {
    backgroundColor: '#2ecc71',
  },
  cancelled: {
    backgroundColor: '#e74c3c',
  },
  deleteBtn: {
    color: '#e74c3c',
    backgroundColor: 'transparent',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    position: 'relative',
  },
  largeModal: {
    backgroundColor: 'white',
    width: '90%',
    height: '75%',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    textAlign: 'center',
  },
  linkBtn: {
    color: '#007bff',
    backgroundColor: 'transparent',
  },
  detailsBtn: {
    backgroundColor: 'transparent',
    color: 'black',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  updateList: {
    padding: 0,
    margin: 0,
  },
  updateItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  tableContainer: {
    width: '100%',
  },
  updateTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  updateTableCell: {
    flex: 1,
    fontSize: 14,
  },
  updateTableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: '600',
  },
});

export default AdminAppointment;


