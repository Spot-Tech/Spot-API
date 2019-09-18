import Hapi from '@hapi/hapi';
import path from 'path';
import wurst from 'wurst';

import serverConfig from "./config/server.js";

const init = async () => {
    const server = Hapi.server(serverConfig);

    console.log(path.join(__dirname, 'lib/routes/oauth2/token/routes.js'));

    const testRoutes = require(path.join(__dirname, 'lib/routes/oauth2/token/routes.js'));

    console.log(JSON.stringify(testRoutes, null, 4));
    await server.register({
        plugin: wurst,
        options: {
            routes: '**/routes.js',
            cwd: path.join(__dirname, 'lib/routes'),
            log: true
        }
    });

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();