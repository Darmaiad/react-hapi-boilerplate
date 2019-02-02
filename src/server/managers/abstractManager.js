
const AbstractManager = (handler) => async (request, h) => {
    try {
        return await handler(request, h);
    } catch (error) {
        return error;
    }
};

export default AbstractManager;
