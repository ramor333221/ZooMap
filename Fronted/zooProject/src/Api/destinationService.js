import { apiClient } from './apiClient';

export const destinationService = {


  getCategoryTypes: () => apiClient('/v1/admin/categories'),
  getAllDestinations: () => apiClient('/v1/public/destinations'),

addDestination: (formData) => {
    const token = localStorage.getItem('auth_token');

    return apiClient('/v1/admin/destinations', {
      method: 'POST',
      headers: { 
          'Authorization': `Bearer ${token}` 
      },
      body: formData 
    });
},

updateDestination: (id, formData) => {
    const token = localStorage.getItem('auth_token');

    return apiClient(`/v1/admin/destinations/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
},
  
  deleteDestination: (id) => apiClient(`/v1/admin/destinations/${id}`, {
    method: 'DELETE',
  }),

};