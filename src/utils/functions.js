import Geolocation from 'react-native-geolocation-service';

export const getUbicacionActual = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
      },
    );
  });
};
