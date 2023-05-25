/* eslint-disable prettier/prettier */
import { http_axios } from '../config/axios';


const getDepartamentos = async () => {
    const response = await http_axios('/api/departamentos');
    const { data } = response.data;
    return data;
};

export default {
    getDepartamentos
}