import { apiClient } from './apiClient';

export const routeService = {

  
getAllRoutes: (userId) => apiClient(`/v1/public/routes`),

addRoute: (routeData) => {
  const token = localStorage.getItem('auth_token'); 
  return apiClient('/v1/admin/routes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(routeData)
  });
},
  
  updateRoute: (routeData) => apiClient('/v1/admin/routes/{id}', {
    method: 'PUT',
    body: JSON.stringify(routeData)
  }),

  deleteRoute: (routeData) => apiClient('/v1/admin/routes/{id}', {
    method: 'DELETE',}),
};