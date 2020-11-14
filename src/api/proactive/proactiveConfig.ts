import axios from "axios";
import { url_base_proactive } from "../url";

const proactiveAPI = axios.create({
  baseURL: url_base_proactive,
});

export default proactiveAPI;
