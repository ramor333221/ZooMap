export const SERVER_IP = '192.168.0.207:8080';

export const BASE_URL = `http://${SERVER_IP}/api`;
export const WS_URL = `ws://${SERVER_IP}/ws-endpoint`;
export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const defaultOptions = {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
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


    const responseText = await response.text();
    try {
      return JSON.parse(responseText); 
    } catch {
      return { message: responseText }; 
    }

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to connect to the server.");
    }
    throw error;
  }
};