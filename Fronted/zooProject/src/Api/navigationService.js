import { apiClient } from './apiClient';

export const navigationService = {
  

  getAllDestinations: () => apiClient('/v1/public/destinations'),

  /**
   * חישוב מסלול אופטימלי (מתאים ל-POST /route)
   * @param {Array<number>} selectedIds
   * @param {number} startId
   * @param {number} endId 
   */
  getOptimizedRoute: (selectedIds, startId = null, endId = null) => {

    let queryParams = '';
    if (startId || endId) {
      const params = new URLSearchParams();
      if (startId) params.append('startId', startId);
      if (endId) params.append('endId', endId);
      queryParams = `?${params.toString()}`;
    }

    return apiClient(`/v1/public/bestRoute${queryParams}`, {
      method: 'POST',
      body: JSON.stringify(selectedIds),
    });
  }
};