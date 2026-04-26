// החליפי את הפורט בפורט שמצאת ב-IntelliJ (בדרך כלל 8080)
const BASE_URL = 'http://127.0.0.1:8080/api'; 

/**
 * פונקציה גנרית לביצוע קריאות HTTP
 * @param {string} endpoint - הנתיב (למשל '/animals')
 * @param {object} options - הגדרות נוספות כמו method, body, headers
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // הגדרות ברירת מחדל לקריאה
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // כאן תוכלי להוסיף בעתיד טוקן של Role/Auth אם תצטרכי
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // ב-Fetch חייבים לבדוק ידנית אם התשובה תקינה (סטטוס 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `שגיאת שרת: ${response.status}`);
    }

    // אם התשובה ריקה (למשל במחיקה), לא ננסה להמיר ל-JSON
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error; // זריקת השגיאה כדי שהקומפוננטה תוכל לטפל בה
  }
};