import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

export default function Layout() {
  const { userType } = useSelector((state) => state.auth);

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            {userType === 'admin' && (
              <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
            )}
            {userType === 'user' && (
              <Stack.Screen name="index" options={{ title: 'User Home' }} />
            )}
            {userType === 'staff' && (
              <Stack.Screen name="index" options={{ title: 'Staff Dashboard' }} />
            )}
          </Stack>
          <Toast />
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
});



  // const handleLogin = async () => {
  //   // Simulate a login request (replace with actual API call if needed)
  //   try {
  //     await dispatch(checkAuth()).unwrap();
  //     // Redirect handled by useEffect
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     alert('Authentication failed. Please check your credentials.');
  //   }
  // };