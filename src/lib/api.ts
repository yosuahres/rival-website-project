import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type {
  ApiError,
  ApiResponse,
  PaginatedApiResponse,
  UninterceptedApiError,
} from "../types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (
    response: AxiosResponse<
      ApiResponse<unknown> | PaginatedApiResponse<unknown>
    >,
  ) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const apiError: ApiError = {
        code: error.response.status,
        status: false,
        message:
          typeof (error.response.data as UninterceptedApiError).message ===
          "string"
            ? (error.response.data as UninterceptedApiError).message
            : JSON.stringify(
                (error.response.data as UninterceptedApiError).message,
              ) || error.message,
      };
      console.error("API Error:", apiError);
      return Promise.reject(apiError);
    } else if (axios.isAxiosError(error) && error.request) {
      const apiError: ApiError = {
        code: 0,
        status: false,
        message: "No response received from server.",
      };
      console.error("No response received:", apiError);
      return Promise.reject(apiError);
    } else {
      const apiError: ApiError = {
        code: -1,
        status: false,
        message: error.message || "Error setting up request.",
      };
      console.error("Error setting up request:", apiError);
      return Promise.reject(apiError);
    }
  },
);

export const API = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  },
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  },
  getPaginated: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<PaginatedApiResponse<T>> => {
    const response = await api.get<PaginatedApiResponse<T>>(url, config);
    return response.data;
  },
};
