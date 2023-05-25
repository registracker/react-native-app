import {ToastAndroid} from 'react-native';

export const showToast = (message, duration = ToastAndroid.LONG) => {
  ToastAndroid.showWithGravity(message, duration, ToastAndroid.TOP);
};
