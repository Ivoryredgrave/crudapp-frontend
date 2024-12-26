import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { setSessionData, removeSessionData } from '../utils/storageUtils';
import { handleError } from '../utils/errorUtils';

export const login = async (username, password, setIsLogged, setUser) => {
    try {
        const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });
        setIsLogged(true);
        setUser(response.data.user);
        setSessionData('isLogged', true);
        setSessionData('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const logout = (setIsLogged, setUser) => {
    setIsLogged(false);
    setUser(null);
    removeSessionData('isLogged');
    removeSessionData('user');
};