import { apiClient } from './apiClient';

export const routeService = {

getAllRoutes: (userId) => apiClient(`/v1/public/routes`),

  // addRoute: (routeData) => apiClient('/v1/admin/routes', {
  //   method: 'POST',
  //   body: JSON.stringify(routeData)
  // }),
  
  addRoute: (routeData) => apiClient('/v1/admin/routes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzc2OTQyOTE1LCJleHAiOjE3NzY5NDY1MTV9.05yOmVStfw-3mp8nOQKRntmLXV8u17Nj64Em_Yfz-30'
    },
    body: JSON.stringify(routeData)
  }),
  
  updateRoute: (routeData) => apiClient('/v1/admin/routes/{id}', {
    method: 'PUT',
    body: JSON.stringify(routeData)
  }),

  deleteRoute: (routeData) => apiClient('/v1/admin/routes/{id}', {
    method: 'DELETE',}),
};