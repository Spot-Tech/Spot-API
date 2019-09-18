// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'POST',
        path: '/{carparkId}/parking-session/{sessionId?}/',
        handler: (request, h) => {
            return {
                carparkId: request.params.carparkId,
                sessionId: request.params.sessionId ? request.params.sessionId : "what"
            };
        }
    },
];