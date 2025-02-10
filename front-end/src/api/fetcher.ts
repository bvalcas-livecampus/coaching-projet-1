const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface FetcherOptions extends RequestInit {
  data?: any;
  method?: string;
}

export const fetcher = async (endpoint: string, options: FetcherOptions = {}) => {
  const { data, method = 'GET', ...customOptions } = options;

  const defaultOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
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
