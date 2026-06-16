import { apiSlice } from './apiSlice';

export const destinationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryTypes: builder.query({
      query: () => '/v1/admin/categories',
      providesTags: ['Category'],
    }),
    getAllDestinations: builder.query({
      query: () => '/v1/public/destinations',
      providesTags: ['Destination'],
    }),
    addDestination: builder.mutation({
      query: (formData) => ({
        url: '/v1/admin/destinations',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Destination'],
    }),
    updateDestination: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/v1/admin/destinations/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Destination'],
    }),
    deleteDestination: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/destinations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Destination'],
    }),
  }),
});

export const {
  useGetCategoryTypesQuery,
  useGetAllDestinationsQuery,
  useAddDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;