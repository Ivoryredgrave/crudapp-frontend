import axios from "axios";
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { handleError } from '../utils/errorUtils';

export const getUsers = async (setData) => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_ALL_USERS);
    setData(response.data);
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_ENDPOINTS.CREATE_USER, userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.UPDATE_USER}/${id}`, userData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};