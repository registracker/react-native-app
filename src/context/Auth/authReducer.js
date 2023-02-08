/* eslint-disable prettier/prettier */
/* eslint-disable no-fallthrough */
import { http_axios } from '../../config/axios';

// generaEstado
export const authReducer = async (state, action) => {
  switch (action.type) {
    case 'signIn':

      const response = await loginAction(action.payload);

      return {
        ...state,
        isLoggedIn: true,
        username: 'USERNAME',
        token: response,
        // username: 'no-username-yet',,
      };

    case 'logout':
      return {
        ...state,
        isLoggedIn: false,
        username: undefined,
        token: undefined,
      };

    default:
      return state;
  }
};

const loginAction = async (params) => {
  try {

    const response = await http_axios('/api/sanctum/token', params, 'post');
    return response?.token;

  } catch (error) {
    console.log('--------Errror', error);
  }
}