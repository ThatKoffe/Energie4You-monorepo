import axios from "axios";

/**
 * API URL
 * Change this to your API URL
 */
export const API_URL = "https://e4u-api.projxd.com";

/**
 * HTTP client
 */
export const http = axios.create({
    baseURL: API_URL + "/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
