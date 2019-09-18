import serverConfig from "../../config/server";

export default [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return {uri: serverConfig.uri, app: request.server.settings.app};
        }
    }
];