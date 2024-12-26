export const handleError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
        throw {
            status: error.response.status,
            message: error.response.data?.error || 'An error occurred',
        };
    } else {
        throw {
            status: 500,
            message: 'Network error or server unavailable',
        };
    }
};