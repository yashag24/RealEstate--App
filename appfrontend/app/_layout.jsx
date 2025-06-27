// app/_layout.jsx or app/(screens)/_layout.jsx
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Toast from 'react-native-toast-message';
// import Navbar from '@/components/home/Navbar';
// import Footer from '@/components/home/Footer';

export default function RootLayout() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
