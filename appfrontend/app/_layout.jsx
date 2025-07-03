import { Stack } from 'expo-router';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from '@/redux/store';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

// Conditional routing based on userType from Redux state
function ConditionalStack() {
  const { userType } = useSelector((state) => state.auth);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {userType === 'admin' && (
        <Stack.Screen
          name="(screens)/admin/index"
          options={{ title: 'Admin Dashboard' }}
        />
      )}
      {userType === 'user' && (
        <Stack.Screen
          name="(screens)/user/index"
          options={{ title: 'User Home' }}
        />
      )}
      {userType === 'staff' && (
        <Stack.Screen
          name="(screens)/staff/index"
          options={{ title: 'Staff Dashboard' }}
        />
      )}
      {/* Fallback if no userType */}
      {!userType && (
        <Stack.Screen
          name="index"
          options={{ title: 'Welcome' }}
        />
      )}
    </Stack>
  );
}

// Root layout wrapping Redux, navigation, and Toast
export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ConditionalStack />
          <Toast />
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Root background color
  },
  container: {
    flex: 1,
  },
});
