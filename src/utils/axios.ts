import axios from "axios";
import { BACKEND_HOST } from "../constants";

const api = axios.create({
  baseURL: BACKEND_HOST,
  withCredentials: true, // indicates whether or not cross-site Access-Control requests should be made using credentials. Setting it to true means we can send cookies with request - ?
});

export default api;
