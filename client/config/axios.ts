import { MESSAGES } from "@/enums/messages";
import { TAccessToken, TResponse } from "@/types/axios";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

const onRequest = (config: InternalAxiosRequestConfig) => {
  const jwtToken = localStorage.getItem("accessToken");
  if (jwtToken !== null) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }

  return config;
};

const onRequestError = (error: AxiosError) => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse) => {
  return response;
};

const onResponseError = async (error: AxiosResponse) => {
  if (error instanceof AxiosError) {
    const { response } = error as AxiosError<TResponse>;

    console.log({ response });

    if (response?.data) {
      const { message } = response?.data;
      if (message === MESSAGES.TOKEN_HAS_EXPIRE) {
        try {
          const res = await axiosInstance.get<TAccessToken>("/token");

          localStorage.setItem("accessToken", res.data.accessToken);
          return axiosInstance.request(error.config);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      if (message === MESSAGES.TOKEN_INVALID) {
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(onRequest, onRequestError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
