import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, performLogout } from '@/redux/Auth/AuthSlice'; // Adjust the import path
import { useRouter } from 'expo-router';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, authUser, userType } = useSelector((state) => state.auth);

  // Initialize authentication on component mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (userType !== 'staff' || !authUser) {
  //     router.push('/(screens)');
  //   }
  // }, [authUser, router]);

  const stats = [
    { label: 'Recent Orders', value: '3', icon: 'bag', color: '#3F51B5' },
    { label: 'Favorites', value: '24', icon: 'heart', color: '#E91E63' },
    { label: 'Reward Points', value: '1,250', icon: 'star', color: '#FFC107' },
    { label: 'Saved Items', value: '12', icon: 'bookmark', color: '#9C27B0' },
  ];

  const quickActions = [
    { title: 'Browse Products', icon: 'search', color: '#4CAF50' },
    { title: 'Shopping Cart', icon: 'cart', color: '#FF5722' },
    { title: 'Order History', icon: 'time', color: '#2196F3' },
    { title: 'Support', icon: 'help-circle', color: '#FF9800' },
  ];

  const handleLogout = () => {

    console.log("Logging out...");
    dispatch(performLogout());
    router.replace('/(screens)');

    
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
              router.replace('/(screens)');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back, STAFF DASHBOARD</Text>
            <Text style={styles.userName}>
              {authUser && userData ? userData.name : 'Guest'}!
            </Text>
          </View>
          {authUser && (
            <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <View style={styles.statHeader}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <Ionicons name={action.icon} size={32} color={action.color} />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Order #1234 delivered</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="heart" size={20} color="#E91E63" />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Added 3 items to favorites</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="star" size={20} color="#FFC107" />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Earned 50 reward points</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutIcon: {
    padding: 8,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default StaffDashboard;