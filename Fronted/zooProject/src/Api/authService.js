import { apiClient } from './apiClient'; 

const AUTH_KEY = 'auth_token';
const ROLE_KEY = 'user_role';

export const authService = {
  /**
   * ביצוע התחברות למערכת
   * @param {string} username 
   * @param {string} password 
   */
  login: async (username, password) => {
    try {
      const data = await apiClient('/v1/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (data.token) {
        localStorage.setItem(AUTH_KEY, data.token);
        localStorage.setItem(ROLE_KEY, data.role);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },


  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);
    window.location.href = '/login'; 
  },

 
  getToken: () => {
    return localStorage.getItem(AUTH_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_KEY);
  }
};