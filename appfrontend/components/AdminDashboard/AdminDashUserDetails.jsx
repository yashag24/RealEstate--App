import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet } from 'react-native';


const AdminDashUserDetails = ({ adminProfile }) => {
  const [users, setUsers] = useState([]);
  const [popupUser, setPopupUser] = useState(null);
  const [popupType, setPopupType] = useState(null); // "searches", "views", "saved"

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!adminProfile) return null;

  const { adminId } = adminProfile;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/users-details?adminId=${adminProfile.adminId}`
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users");
      }
    };

    fetchUsers();
  }, [adminProfile.adminId]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = [...users].reverse().filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.includes(query);

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter;

    return matchesQuery && matchesRole;
  });

  const openPopup = (user, type) => {
    setPopupUser(user);
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupUser(null);
    setPopupType(null);
  };

  const renderPopupData = () => {
    if (!popupUser || !popupType) return null;

    if (popupType === "searches") {
      return popupUser.searches?.map((s) => (
        <div className={styles.chartRow} key={s._id}>
          <span>{s.search_text}</span>
          <span>{new Date(s.search_datetime).toLocaleString()}</span>
        </div>
      ));
    }

    const dataList =
      popupType === "views" ? popupUser.previousView : popupUser.saveProperties;

    return dataList?.map((item) => {
      const p = item.propertyId || item;
      return (
        <div className={styles.chartRow} key={item._id}>
          <span>{p.title}</span>
          <span>{p.city}</span>
          <span>₹{p.price}</span>
        </div>
      );
    });
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminTitleSearch}>
        <h2 className={styles.title}>All Registered Users</h2>
        <div className={styles.searchFilterContainer}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <select
            className={styles.filterDropdown}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="builder">Builder</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.noDataRow}>
                  No data found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.image || "./builder.jpeg"}
                      className={styles.userImg}
                      alt="User"
                    />
                  </td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.city === "City" ? "-" : user.city}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className={styles.BtnAdminDash}
                      onClick={() => openPopup(user, "searches")}
                    >
                      Searches
                    </button>
                    <button
                      className={styles.BtnAdminDash}
                      onClick={() => openPopup(user, "views")}
                    >
                      Previous Views
                    </button>
                    <button
                      className={styles.BtnAdminDash}
                      onClick={() => openPopup(user, "saved")}
                    >
                      Saved Properties
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {popupUser && popupType && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.popupHeading}>
              {popupType === "searches"
                ? "User Searches"
                : popupType === "views"
                ? "User Previous Views"
                : "User Saved Properties"}
            </h3>
            <button onClick={closePopup} className={styles.closeBtn}>
              ✕
            </button>
            <div className={styles.chartContainer}>
              <div className={styles.chartHeader}>
                {popupType === "searches" ? (
                  <>
                    <span>Search Text</span>
                    <span>Timestamp</span>
                  </>
                ) : (
                  <>
                    <span>Title</span>
                    <span>City</span>
                    <span>Price</span>
                  </>
                )}
              </div>
              <div className={styles.chartBody}>{renderPopupData()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const styles = StyleSheet.create({
  adminContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  adminTitleSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '30%',
  },
  filterDropdown: {
    padding: 8,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    minWidth: 120,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
  },
  userTable: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  tableCell: {
    padding: 12,
    textAlign: 'center',
    flex: 1,
  },
  tableHeaderCell: {
    backgroundColor: '#00aaff',
    color: 'white',
    fontWeight: 'bold',
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  BtnAdminDash: {
    marginVertical: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 4,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    overflow: 'hidden',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'crimson',
    color: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  popupHeading: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'column',
    maxHeight: '60%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
  },
  chartHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  chartBody: {
    flexDirection: 'column',
  },
  chartRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chartCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default AdminDashUserDetails;
