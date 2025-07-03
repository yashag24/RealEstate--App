import { Slot, useRouter, useNavigationContainerRef } from 'expo-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function StaffLayout() {
   const { userType, authUser } = useSelector((state) => state.auth);
 const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!userType) return; // wait until auth is available

    if (userType !== 'staff' || !authUser) {
      // ✅ Wrap in requestAnimationFrame to let layout mount first
      requestAnimationFrame(() => {
        router.replace('/');
      });
    } else {
      setHasChecked(true);
    }
  }, [userType]);

 if (!hasChecked && userType === 'user') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
