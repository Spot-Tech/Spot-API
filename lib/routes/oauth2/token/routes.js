 import serverConfig from "../../../../config/server";

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return {uri: serverConfig.uri, app: request.server.settings.app};
        }
    }
];