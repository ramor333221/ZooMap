import { apiClient } from './apiClient';

export const destinationService = {

  // שליפת כל הקטגוריות
  getCategoryTypes: () => apiClient('/v1/admin/categories'),

  // שליפת כל היעדים (הוספתי למקרה שתצטרכי)
  getAllDestinations: () => apiClient('/v1/public/destinations'),

  // הוספת יעד חדש
  addDestination: (destinationData) => {
    const token = localStorage.getItem('auth_token'); 
    return apiClient('/v1/admin/destinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(destinationData)
    });
  },
  
  // עדכון יעד קיים - שימי לב לשימוש ב-Backticks ובשליחת ה-ID
  updateDestination: (id, destinationData) => apiClient(`/v1/admin/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(destinationData)
  }),

  // מחיקת יעד - מקבל רק ID ומוסיף אותו לנתיב
  deleteDestination: (id) => apiClient(`/v1/admin/destinations/${id}`, {
    method: 'DELETE',
  }),

};