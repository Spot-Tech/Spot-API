import serverConfig from "../../config/server";

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            auth: false
        },
        handler: (request, h) => {
            return request.server.settings.app;
        }
    }
];