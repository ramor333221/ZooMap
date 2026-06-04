export const SERVER_IP = '192.168.0.207:8080';

export const BASE_URL = `http://${SERVER_IP}/api`;
export const WS_URL = `ws://${SERVER_IP}/ws-endpoint`;
export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // If the body is an instance of FormData, the browser MUST set 
  // the Content-Type automatically to include the boundary.
  const isFormData = options.body instanceof FormData;

  const defaultOptions = {
    ...options,
    headers: {
      // Only set JSON header if it's NOT FormData
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      // Handle errors (try JSON, fallback to text)
      const errorText = await response.text();
      let errorMessage;
      try {
        errorMessage = JSON.parse(errorText).message || errorText;
      } catch {
        errorMessage = errorText || `Server Error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    // --- THE FIX STARTS HERE ---
    const responseText = await response.text();
    try {
      return JSON.parse(responseText); // Try to parse as JSON
    } catch {
      return { message: responseText }; // If it fails, return text as a message object
    }
    // --- THE FIX ENDS HERE ---

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to the server.");
    }
    throw error;
  }
};