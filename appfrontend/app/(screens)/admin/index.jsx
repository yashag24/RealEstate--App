import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import  Toast  from 'react-native-toast-message';
import { useRouter } from 'expo-router';
//import { router } from 'expo-router';
import { View, ScrollView,Text,StyleSheet , Platform } from 'react-native';
import Navbar from '@/components/home/Navbar';
import AdminSideBar from '@/components/AdminDashboard/AdminSideBar';
import AdminProfile from '@/components/AdminDashboard/AdminProfile';
import AdminDashUserDetails from '@/components/AdminDashboard/AdminDashUserDetails';
import AdminAppointment from '@/components/AdminDashboard/AdminAppointment';
import AdminPropertyVerification from '@/components/AdminDashboard/AdminPropertyVerification';
import AdminReviews from '@/components/AdminDashboard/AdminReviews';
import AdminEnquiries from '@/components/AdminDashboard/AdminEnquiries';
import AdminList from '@/components/AdminDashboard/AdminList';
//import StaffManagement from '@/components/AdminDashboard/StaffManagement';
//import StaffPerformanceCategories from '@/components/AdminDashboard/StaffPerformanceCategories';
//import AdminContractorVerification from '@/components/AdminDashboard/AdminContractorVerification';
import AdminModal from '@/components/AdminDashboard/Modal';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    const savedSection = localStorage.getItem('activeSection') || 'adminProfile';
    setActiveSection(savedSection);

    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminProfile(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken'); // You may replace with SecureStore/AsyncStorage for production

      const [
        appointmentsRes,
        propertiesRes,
        reviewsRes,
        enquiriesRes,
        adminsRes,
        contractorsRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}/api/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${BASE_URL}/api/property/verification`),
        fetch(`${BASE_URL}/api/reviews/get-all-reviews`),
        fetch(`${BASE_URL}/api/enquiry/get-all-enquiry`),
        fetch(`${BASE_URL}/api/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${BASE_URL}/api/contractor/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (
        !appointmentsRes.ok ||
        !propertiesRes.ok ||
        !reviewsRes.ok ||
        !enquiriesRes.ok ||
        !adminsRes.ok ||
        !contractorsRes.ok
      ) {
        throw new Error('Failed to fetch data.');
      }

      const appointmentsData = await appointmentsRes.json();
      const propertiesData = await propertiesRes.json();
      const reviewsData = await reviewsRes.json();
      const enquiriesData = await enquiriesRes.json();
      const adminsData = await adminsRes.json();
      const contractorsData = await contractorsRes.json();

      console.log('All Contractors Data:', contractorsData);
      console.log(propertiesData);

      if (appointmentsData.success) {
        setAppointments(appointmentsData.appointments);
      }
      if (propertiesData.success) {
        setProperties(propertiesData.property_verify);
      }
      if (adminsData.success) {
        setAdmins(adminsData.data);
      }
      if (reviewsData.success) {
        setReviews(reviewsData.reviews);
      }
      if (enquiriesData.success) {
        setEnquiries(enquiriesData.enquiries);
      }

      if (Array.isArray(contractorsData)) {
        setContractors(contractorsData);
      } else if (contractorsData.success) {
        setContractors(contractorsData.contractors);
      } else if (contractorsData.data) {
        setContractors(contractorsData.data);
      } else {
        setContractors([]);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch data. Please try again.',
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  console.log(adminProfile);

  const handleRemoveAppointment = async (id) => {
    try {
      const token = localStorage.getItem('authToken'); // Replace with AsyncStorage for production
      if (!token) {
        throw new Error('No authorization token found');
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/appointments/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete the appointment');
      }

      setAppointments((prev) => prev.filter((a) => a._id !== id));

      Toast.show({
        type: 'success',
        text1: 'Appointment deleted successfully!',
      });
    } catch (error) {
      console.error(error.message);
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong while deleting.',
      });
    }
  };

  const handleAcceptProperty = async (id) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/property/${id}/accept`,
        { method: 'PUT' }
      );
      const result = await response.json();
      if (!result.success || !response.ok) {
        alert('Accepting property failed, please try later');
        return;
      }
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({
        type: 'success',
        text1: 'Property accepted successfully',
      });
    } catch (error) {
      console.error('Error accepting property:', error);
    }
  };

  const handleRejectProperty = async (id) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/property/${id}/reject`,
        { method: 'PUT' }
      );
      const result = await response.json();
      if (!result.success || !response.ok) {
        alert('Rejecting property failed, please try later');
        return;
      }
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({
        type: 'success',
        text1: 'Property rejected successfully',
      });
    } catch (error) {
      console.error('Error rejecting property:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('activeSection');
    localStorage.removeItem('role');

    Toast.show({
      type: 'success',
      text1: 'Logged out successfully!',
    });

    router.push('/admin-login'); // navigate replacement
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/admin/${adminId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      const result = text ? JSON.parse(text) : { success: response.ok };

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete admin');
      }

      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));

      Toast.show({
        type: 'success',
        text1: 'Admin deleted successfully!',
      });
    } catch (error) {
      console.error(error.message);
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong while deleting.',
      });
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section); // Replace with AsyncStorage if needed
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleDeleteEnquiry = async (enquiryId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/enquiry/${enquiryId}/delete`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        Toast.show({
          type: 'success',
          text1: 'Enquiry deleted successfully',
        });
        setEnquiries((prev) => prev.filter((e) => e._id !== enquiryId));
      } else {
        Toast.show({
          type: 'error',
          text1: data.message || 'Failed to delete enquiry',
        });
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      Toast.show({
        type: 'error',
        text1: 'An error occurred while deleting the enquiry',
      });
    }
  };

  // contractor
  const handleAcceptContractor = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/contractor/verify/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        alert('Accepting contractor failed, please try later');
        return;
      }
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({
        type: 'success',
        text1: 'Contractor verified successfully',
      });
    } catch (error) {
      console.error('Error accepting contractor:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to verify contractor',
      });
    }
  };

  const handleRejectContractor = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/contractor/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        alert('Rejecting contractor failed, please try later');
        return;
      }
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({
        type: 'success',
        text1: 'Contractor rejected successfully',
      });
    } catch (error) {
      console.error('Error rejecting contractor:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to reject contractor',
      });
    }
  };

  // run fetchData when navigating here
  useEffect(() => {
    fetchData();
  }, [router]);

  console.log(enquiries);

    return (
    <View style={styles.wrapper}>
      <Navbar />
      <View style={styles.dashboardContainer}>
        <AdminSideBar
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
          handleShowModal={handleShowModal}
          handleLogout={handleLogout}
        />

        <ScrollView contentContainerStyle={styles.content}>
          {activeSection === 'adminProfile' && adminProfile && (
            <AdminProfile adminProfile={adminProfile} />
          )}
          {activeSection === 'adminDashUserDetails' && (
            <AdminDashUserDetails adminProfile={adminProfile} />
          )}
          {activeSection === 'appointments' && (
            <AdminAppointment
              appointments={appointments}
              loading={loading}
              error={error}
              handleRemoveAppointment={handleRemoveAppointment}
            />
          )}
          {activeSection === 'propertyVerification' && (
            <AdminPropertyVerification
              properties={properties}
              loading={loading}
              error={error}
              handleAcceptProperty={handleAcceptProperty}
              handleRejectProperty={handleRejectProperty}
            />
          )}
          {activeSection === 'reviews' && (
            <AdminReviews
              reviews={reviews || []}
              adminId={adminProfile?.adminId}
            />
          )}
          {activeSection === 'enquiries' && (
            <AdminEnquiries
              enquiries={enquiries}
              onDeleteEnquiry={handleDeleteEnquiry}
            />
          )}
          {activeSection === 'adminsList' && (
            <AdminList
              admins={admins || []}
              onAddAdminClick={handleShowModal}
              handleRemoveAdmin={handleRemoveAdmin}
              loading={loading}
              error={error}
            />
          )}
          {activeSection === 'staffManagement' && <StaffManagement />}
          {activeSection === 'staffPerformance' && (
            <StaffPerformanceCategories />
          )}
          {activeSection === 'contractorVerification' && (
            <AdminContractorVerification
              contractors={contractors}
              loading={loading}
              error={error}
              handleAcceptContractor={handleAcceptContractor}
              handleRejectContractor={handleRejectContractor}
            />
          )}
        </ScrollView>
        <AdminModal show={showModal} handleClose={handleCloseModal} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adminDashboard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    paddingTop: Platform.OS === 'web' ? 72 : 0, // To mimic margin-top
  },
  sidebar: {
    width: 220,
    backgroundColor: '#1f2937',
    color: '#fff',
    flexDirection: 'column',
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 16, // requires React Native 0.71+ or use marginBottom on children
    position: 'relative',
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1,
  },
  sidebarText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  activeSidebarText: {
    backgroundColor: '#2563eb',
    color: '#fff',
  },
  sidebarTextHover: {
    backgroundColor: '#374151', // optional; may need TouchableOpacity with pressIn/out
  },
  logoutButton: {
    marginTop: 'auto',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  logoutButtonHover: {
    backgroundColor: '#dc2626',
  },
  content: {
    flex: 1,
    // paddingHorizontal: 32,
  },

  /** For responsive layout simulation (optional) **/
  mobileDashboard: {
    flexDirection: 'column',
  },
  mobileSidebar: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
    padding: 16,
  },
  mobileLogoutButton: {
    width: '100%',
    marginTop: 16,
  },
});

export default AdminDashboard;