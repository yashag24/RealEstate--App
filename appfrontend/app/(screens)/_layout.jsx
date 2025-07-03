import { Stack } from 'expo-router';
import React from 'react';

// Screens layout must return only Stack for nested routing
export default function ScreensLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
