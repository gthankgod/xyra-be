const success = (message, data = null) => ({ status: 'successful', message, data });
const error = (message) => ({ status: 'error', message, data: null });

module.exports = { success, error };
