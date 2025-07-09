// app/_layout.jsx or app/(screens)/_layout.jsx
import { Slot, Stack } from "expo-router";
import { View, StyleSheet, Appearance } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Toast from "react-native-toast-message";
import { toastConfig } from "../toastConfig.js";
import { SafeAreaView } from "react-native-safe-area-context";

const colorScheme = Appearance.getColorScheme();
const windowBackground = colorScheme === "dark" ? "#000" : "#fff";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:windowBackground, // whatever your root bg is
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
