// app/_layout.jsx or app/(screens)/_layout.jsx
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* <Navbar /> */}
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
          {/* <Footer /> */}
          <Toast />
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black'// whatever your root bg is
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});