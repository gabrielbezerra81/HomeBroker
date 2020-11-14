import axios from "axios";
import axiosRetry from "axios-retry";
import { url_base } from "./url";

const api = axios.create({
  baseURL: url_base,
});

axiosRetry(api);

export default api;
