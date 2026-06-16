import { apiSlice } from './apiSlice';

const AUTH_KEY = 'auth_token';
const ROLE_KEY = 'user_role';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: '/v1/admin/login',
        method: 'POST',
        body: { username, password }, 
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.token) {
            localStorage.setItem(AUTH_KEY, data.token);
            localStorage.setItem(ROLE_KEY, data.role);
          }
        } catch (error) {
        }
      },
    }),
  }),
});

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ROLE_KEY);
  window.location.href = '/login';
};

export const getToken = () => localStorage.getItem(AUTH_KEY);
export const isAuthenticated = () => !!localStorage.getItem(AUTH_KEY);

export const { useLoginMutation } = authApi;