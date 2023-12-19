import axios from "axios";

/**
 * API URL
 * Change this to your API URL
 */
export const API_URL = "http://192.168.68.107:3000";

/**
 * HTTP client
 */
export const http = axios.create({
    baseURL: API_URL + "/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
