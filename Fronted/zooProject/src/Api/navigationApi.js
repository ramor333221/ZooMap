import { apiSlice } from './apiSlice';

export const navigationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOptimizedRoute: builder.mutation({
      query: ({ selectedIds, startId = null, endId = null }) => {
        const params = new URLSearchParams();
        if (startId) params.append('startId', startId);
        if (endId) params.append('endId', endId);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        
        return {
          url: `/v1/public/bestRoute${queryString}`,
          method: 'POST',
          body: selectedIds,
        };
      },
    }),
  }),
});

export const {
  useGetOptimizedRouteMutation,
} = navigationApi;