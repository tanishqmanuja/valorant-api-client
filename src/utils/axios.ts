import axios, { CreateAxiosDefaults } from "axios";
import axiosRetry from "axios-retry";

const createAxiosInstance = (config?: CreateAxiosDefaults) => {
  const newInstance = axios.create(config);

  axiosRetry(newInstance);

  return newInstance;
};

export { createAxiosInstance };

export default axios;
