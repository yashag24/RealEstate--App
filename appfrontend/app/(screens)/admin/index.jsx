import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, performLogout } from '@/redux/Auth/AuthSlice';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import Navbar from '@/components/home/Navbar';
import AdminSideBar from '@/components/AdminDashboard/AdminSideBar';
import AdminProfile from '@/components/AdminDashboard/AdminProfile';
import AdminDashUserDetails from '@/components/AdminDashboard/AdminDashUserDetails';
import AdminAppointment from '@/components/AdminDashboard/AdminAppointment';
import AdminPropertyVerification from '@/components/AdminDashboard/AdminPropertyVerification';
import AdminReviews from '@/components/AdminDashboard/AdminReviews';
import AdminEnquiries from '@/components/AdminDashboard/AdminEnquiries';
import AdminList from '@/components/AdminDashboard/AdminList';
import StaffManagement from '@/components/StaffDashboard/StaffManagement';
import StaffPerformanceCategories from '@/components/AdminDashboard/StaffPerformanceCategories';
import AdminContractorVerification from '@/components/AdminDashboard/AdminContractorVerification';
import CustomModal from '@/components/AdminDashboard/Modal';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, authUser, userType } = useSelector((state) => state.auth);

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
  const [showModal, setShowModal] = useState(false);

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Initialize authentication on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (userType !== 'admin' || !authUser) {
      router.replace('/(screens)');
    }
  }, [authUser, router, userType]);

  // Load dashboard data
  useEffect(() => {
    const loadInitialData = async () => {
      const savedSection = await AsyncStorage.getItem('activeSection') || 'adminProfile';
      setActiveSection(savedSection);

      let token = authUser?.token;
      if (!token) {
        token = await AsyncStorage.getItem('authToken');
      }
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setAdminProfile(decoded);
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
      fetchData(token);
    };

    loadInitialData();
    // eslint-disable-next-line
  }, [authUser]);

  const fetchData = async (token) => {
    setLoading(true);
    try {
      const [
        appointmentsRes,
        propertiesRes,
        reviewsRes,
        enquiriesRes,
        adminsRes,
        contractorsRes
      ] = await Promise.all([
        fetch(`${BASE_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/property/verification`),
        fetch(`${BASE_URL}/api/reviews/get-all-reviews`),
        fetch(`${BASE_URL}/api/enquiry/get-all-enquiry`),
        fetch(`${BASE_URL}/api/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/contractor/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [appointmentsData, propertiesData, reviewsData, enquiriesData, adminsData, contractorsData] = await Promise.all([
        appointmentsRes.json(),
        propertiesRes.json(),
        reviewsRes.json(),
        enquiriesRes.json(),
        adminsRes.json(),
        contractorsRes.json()
      ]);

      if (appointmentsData.success) setAppointments(appointmentsData.appointments);
      if (propertiesData.success) setProperties(propertiesData.property_verify);
      if (adminsData.success) setAdmins(adminsData.data);
      if (reviewsData.success) setReviews(reviewsData.reviews);
      if (enquiriesData.success) setEnquiries(enquiriesData.enquiries);

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
      setError(err.message);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to fetch data.' });
    } finally {
      setLoading(false);
    }
  };

  // --- All other handlers remain unchanged (handleRemoveAppointment, handleAcceptProperty, etc.) ---

  const handleRemoveAppointment = async (id) => {
    try {
      const token = authUser?.token || await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      Toast.show({ type: 'success', text1: 'Appointment deleted' });
    } catch (error) {
      Toast.show({ type: 'error', text1: error.message });
    }
  };

  const handleAcceptProperty = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${id}/accept`, { method: 'PUT' });
      const result = await response.json();
      if (!result.success || !response.ok) throw new Error('Accepting property failed');
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({ type: 'success', text1: 'Property accepted' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectProperty = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${id}/reject`, { method: 'PUT' });
      const result = await response.json();
      if (!result.success || !response.ok) throw new Error('Rejecting property failed');
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({ type: 'success', text1: 'Property rejected' });
    } catch (error) {
      console.error(error);
    }
  };

  // Logout with Redux and confirmation
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(performLogout()).unwrap();
              await AsyncStorage.multiRemove(['authToken', 'activeSection', 'role']);
              Toast.show({ type: 'success', text1: 'Logged out successfully!' });
              router.replace('/(screens)');
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Failed to logout. Please try again.' });
            }
          },
        },
      ]
    );
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      const token = authUser?.token || await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/admin/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
      Toast.show({ type: 'success', text1: 'Admin deleted' });
    } catch (error) {
      Toast.show({ type: 'error', text1: error.message });
    }
  };

  const handleSectionChange = async (section) => {
    setActiveSection(section);
    await AsyncStorage.setItem('activeSection', section);
  };

  const handleDeleteEnquiry = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/enquiry/${id}/delete`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok && data.success) {
        Toast.show({ type: 'success', text1: 'Enquiry deleted' });
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      } else {
        Toast.show({ type: 'error', text1: data.message });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to delete enquiry' });
    }
  };

  const handleAcceptContractor = async (id) => {
    try {
      const token = authUser?.token || await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/contractor/verify/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error();
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({ type: 'success', text1: 'Contractor verified' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to verify contractor' });
    }
  };

  const handleRejectContractor = async (id) => {
    try {
      const token = authUser?.token || await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/api/contractor/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error();
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({ type: 'success', text1: 'Contractor rejected' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to reject contractor' });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Navbar />
      <View style={styles.dashboardContainer}>
        <AdminSideBar
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
          handleShowModal={() => setShowModal(true)}
          handleLogout={handleLogout}
        />
        <ScrollView contentContainerStyle={styles.content}>
          {activeSection === 'adminProfile' && <AdminProfile adminProfile={adminProfile} />}
          {activeSection === 'adminDashUserDetails' && <AdminDashUserDetails adminProfile={adminProfile} />}
          {activeSection === 'appointments' && (
            <AdminAppointment appointments={appointments} loading={loading} error={error} handleRemoveAppointment={handleRemoveAppointment} />
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
            <AdminReviews reviews={reviews || []} adminId={adminProfile?.adminId} />
          )}
          {activeSection === 'enquiries' && (
            <AdminEnquiries enquiries={enquiries} onDeleteEnquiry={handleDeleteEnquiry} />
          )}
          {activeSection === 'adminsList' && (
            <AdminList
              admins={admins}
              onAddAdminClick={() => setShowModal(true)}
              handleRemoveAdmin={handleRemoveAdmin}
              loading={loading}
              error={error}
            />
          )}
          {activeSection === 'staffManagement' && <StaffManagement />}
          {activeSection === 'staffPerformance' && <StaffPerformanceCategories />} 
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
        <CustomModal show={showModal} handleClose={() => setShowModal(false)} />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f7fa',
    paddingTop: Platform.OS === 'web' ? 72 : 0,
  },
  content: { flex: 1 },
});

export default AdminDashboard;
