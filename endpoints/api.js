import axios from "axios"
import Cookies from "js-cookie";

const API_URL = process.env.API_URL;

const createApi = (baseURL) => {
  const api = axios.create({
    baseURL
  })

  api.interceptors.request.use(function (config) {
    return new Promise((resolve) => {
      const token = Cookies.get('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(config);
    })
  }, function (error) {
    return Promise.reject(error.response);
  })

  api.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    return Promise.reject(error.response);
  })

  return api
}

export const API = createApi(API_URL);