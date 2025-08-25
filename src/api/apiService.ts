/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, AxiosError } from 'axios';

// Base configuration
const API_BASE_URL = 'https://ods2025.onrender.com/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error Response:', error);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Exhibitor endpoints
  exhibitors: {
    create: async (data: any): Promise<AxiosResponse> => {
      return apiClient.post('/exhibitor/create', data);
    },
    getAll: async (): Promise<AxiosResponse> => {
      return apiClient.get('/exhibitor/all');
    },
    search: async (keyword: string): Promise<AxiosResponse> => {
      return apiClient.get(`/exhibitor/search?keyword=${encodeURIComponent(keyword)}`);
    }
  },

  // Sponsor endpoints
  sponsors: {
    create: async (data: any): Promise<AxiosResponse> => {
      return apiClient.post('/sponsor/create', data);
    },
    getAll: async (): Promise<AxiosResponse> => {
      return apiClient.get('/sponsor/all');
    },
    search: async (keyword: string): Promise<AxiosResponse> => {
      return apiClient.get(`/sponsor/search?keyword=${encodeURIComponent(keyword)}`);
    }
  }
};

// Export the axios instance for direct use if needed
export { apiClient };

// Export types
export type { AxiosResponse, AxiosError };
