import serverConfig from "./config/server.js";
import routes from './lib/routes';

import Hapi from '@hapi/hapi';

const init = async () => {
    const server = Hapi.server(serverConfig);

    // Set up the routes
    server.route(routes);

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();