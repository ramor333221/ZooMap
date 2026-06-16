import { apiSlice } from './apiSlice';

export const routeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoutes: builder.query({
      query: () => '/v1/public/routes',
      providesTags: ['Route'],
    }),
    addRoute: builder.mutation({
      query: (routeData) => ({
        url: '/v1/admin/routes',
        method: 'POST',
        body: routeData,
      }),
      invalidatesTags: ['Route'],
    }),
    updateRoute: builder.mutation({
      query: ({ id, routeData }) => ({
        url: `/v1/admin/routes/${id}`,
        method: 'PUT',
        body: routeData,
      }),
      invalidatesTags: ['Route'],
    }),
    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/routes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Route'],
    }),
  }),
});

export const {
  useGetAllRoutesQuery,
  useAddRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
} = routeApi;