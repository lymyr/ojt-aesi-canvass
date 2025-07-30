import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // your Laravel URL
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;
