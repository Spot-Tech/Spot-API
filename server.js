import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import path from 'path';
import authBearer from 'hapi-auth-bearer-token';
import wurst from 'wurst';

import authConfig from './config/auth.js';
import databaseConfig from './config/database';
import serverConfig from './config/server.js';

import models from './lib/models';

const prepDatabase = async () => {
    // Connect to the database
    await mongoose
        .connect(databaseConfig.uri, databaseConfig.options);
};

const initServer = async () => {
    const server = Hapi.server(serverConfig);

    // Register Auth Bearer plugin
    await server.register(authBearer);

    server.auth.strategy('bearer', 'bearer-access-token', authConfig);

    server.auth.default('bearer');

    // Register Wurst plugin
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

    return true;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

prepDatabase()
    .then(
        () => {
            console.log(`Database connection to ${databaseConfig.uri} is successful.\nThe following options were applied: ${JSON.stringify(databaseConfig.options)}`);

            console.log(`Initializing the server...`);

            return initServer();
        },
        error => {
            console.error(error);

            console.error(`Server startup failed...`);
        }
    );