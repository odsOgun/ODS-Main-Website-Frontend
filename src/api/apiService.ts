/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <any> */
import axios, { type AxiosError, type AxiosResponse } from 'axios';

const API_BASE_URL = 'https://ods2025.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// -------------------- REQUEST INTERCEPTOR --------------------
apiClient.interceptors.request.use(
  (config) => config,
  (error) => {
    throw error;
  }
);

// -------------------- RESPONSE INTERCEPTOR --------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // success → pass through
  (error: AxiosError) => {
    // If request never reached server → CORS / Network error
    if (!error.response) {
      throw {
        status: null,
        message: 'Network error. Check internet or CORS configuration.',
        data: null
      };
    }

    // Normalize backend error shape
    throw {
      status: error.response.status,
      message: (error.response.data as any)?.message ?? 'Request failed. Please try again.',
      data: error.response.data
    };
  }
);

// -------------------- API SERVICE --------------------

// API service functions
export const apiService = {
  // Attendee endpoints
  attendees: {
    register: async (data: any): Promise<AxiosResponse> => {
      return apiClient.post('/attendee/register', data);
    },
    requestImpactReport: async (data: any): Promise<AxiosResponse<Blob>> => {
      return apiClient.post('/report/impact', data, {
        responseType: 'blob'
      });
    }
  },

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
  },

  // Speakers endpoints
  speakers: {
    create: async (data: any): Promise<AxiosResponse> => {
      return apiClient.post('/speaker/create', data);
    }
  }
};

// Export the axios instance for direct use if needed
export { apiClient };

// Export types
export type { AxiosResponse, AxiosError };
