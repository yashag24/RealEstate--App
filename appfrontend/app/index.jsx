// app/index.jsx
import { View } from "react-native";
import { Link, Redirect } from "expo-router";

export default function Index() {
  return (
    <View>
      <Redirect href="/(screens)/home" />;
      <Redirect href="/(screens)/admin" />
    </View>

  );
}
