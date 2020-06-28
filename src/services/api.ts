import axios from "axios";

const api = axios.create({
  baseURL:
    `${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`,
});

export default api;
