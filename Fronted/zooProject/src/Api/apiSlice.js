import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const SERVER_IP = '192.168.0.207:8080';
export const BASE_URL = `http://${SERVER_IP}/api`;
export const WS_URL = `ws://${SERVER_IP}/ws-endpoint`;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['Destination', 'Category'], 
  endpoints: () => ({}), 
});