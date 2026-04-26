import { apiClient } from './apiClient';

export const navigationService = {
  
  // שליפת כל היעדים להצגה (מתאים ל-GET /destinations)
  getAllDestinations: () => apiClient('/v1/public/destinations'),

  /**
   * חישוב מסלול אופטימלי (מתאים ל-POST /route)
   * @param {Array<number>} selectedIds - רשימת מזהי הנקודות
   * @param {number} startId - מזהה נקודת התחלה (אופציונלי)
   * @param {number} endId - מזהה נקודת סיום (אופציונלי)
   */
  getOptimizedRoute: (selectedIds, startId = null, endId = null) => {
    // בניית ה-Query Parameters עבור startId ו-endId
    let queryParams = '';
    if (startId || endId) {
      const params = new URLSearchParams();
      if (startId) params.append('startId', startId);
      if (endId) params.append('endId', endId);
      queryParams = `?${params.toString()}`;
    }

    return apiClient(`/v1/public/route${queryParams}`, {
      method: 'POST',
      body: JSON.stringify(selectedIds), // שולח את רשימת ה-IDs כפי שהשרת מצפה
    });
  }
};