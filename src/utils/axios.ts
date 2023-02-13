import axios, { AxiosInstance } from "axios";
import BaseUrls from "@/utils/baseURLs";

const apiBackendInstance: AxiosInstance = axios.create({
  baseURL: BaseUrls.getBackendUrl(),
});
export default apiBackendInstance;
