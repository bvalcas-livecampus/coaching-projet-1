import { getStorageItem } from '../utils/storage';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface FetcherOptions extends RequestInit {
  data?: any;
  method?: string;
}

export const fetcher = async (endpoint: string, options: FetcherOptions = {}) => {
  const { data, method = 'GET', ...customOptions } = options;

  // Get token from localStorage
  const token = getStorageItem('token');

  const defaultOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(token),
    },
  };

  const fetchOptions: RequestInit = {
    ...defaultOptions,
    ...customOptions,
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
