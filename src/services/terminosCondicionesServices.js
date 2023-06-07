import {instance} from '../config/axios';

export const getTerminosCondiciones = async () => {
  const response = await instance('/api/terminos-condiciones');
  const {data} = response.data;
  console.log("🚀 ~ file: terminosCondicionesServices.js:6 ~ getTerminosCondiciones ~ data:", data)
  return data;
};
