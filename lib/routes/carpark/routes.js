// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'GET',
        path: '/{carparkId}/parking-session/{sessionId?}/',
        config: {
            auth: 'jwt'
        },
        handler: (request, h) => {
            return {
                carparkId: request.params.carparkId,
                sessionId: request.params.sessionId ? request.params.sessionId : "what"
            };
        }
    },
];