import axios from "axios";
import queryString from "query-string";

// Set up default config for http requests here
// Please have a look at here https://github.com/axios/axios#request- config for the full list of configs
const axiosClient = axios.create({
    // baseURL: process.env.REACT_APP_API_URL,
    baseURL: "http://54.208.8.227:8000/",
    headers: {
        "content-type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return error;
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle errors
        return error;
    }
);

export default axiosClient