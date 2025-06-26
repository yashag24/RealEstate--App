import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayout() {
  return (
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
    </View>
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