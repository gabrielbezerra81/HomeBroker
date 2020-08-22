import axios from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";
import { url_base } from "./url";

declare module "axios" {
  export interface AxiosRequestConfig {
    "axios-retry"?: IAxiosRetryConfig;
  }
}

const api = axios.create({
  baseURL: url_base,
});

axiosRetry(api);

export default api;
