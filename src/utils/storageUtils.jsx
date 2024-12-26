export const getSavedTheme = () => localStorage.getItem('theme') ?? 'light';

export const getUserFromSession = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user ?? {};
    } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
        return {};
    }
};

export const getSessionData = (key) => {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        console.error(`Error getting ${key} from sessionStorage:`, error);
        return null;
    }
};

export const setSessionData = (key, value) => {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error setting ${key} in sessionStorage:`, error);
    }
};

export const removeSessionData = (key) => {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from sessionStorage:`, error);
    }
};