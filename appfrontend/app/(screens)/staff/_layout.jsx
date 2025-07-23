import { Slot, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function StaffLayout() {
  const { userType, authUser } = useSelector((state) => state.auth);
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!userType) return;

    if (userType !== 'staff' || !authUser) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          router.replace('/');
        }, 0);
      });
    } else {
      setHasChecked(true);
    }
  }, [userType, authUser]);

  if (!hasChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
