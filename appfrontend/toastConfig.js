// toastConfig.js
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        zIndex: 9999,
        elevation: 9999, // for Android
        position: 'absolute', // important
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
       text1Style={{
        fontSize: 10,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'red',
        zIndex: 9999,
        elevation: 9999,
        position: 'absolute',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 10,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
      }}
    />
  ),
};
