import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import path from 'path';
import authJwt2 from 'hapi-auth-jwt2';
import wurst from 'wurst';

import jwtConfig from './config/jwt.js';
import databaseConfig from './config/database';
import serverConfig from './config/server.js';

const prepDatabase = async () => {
    // Connect to the database
    await mongoose
        .connect(databaseConfig.uri, databaseConfig.options);
};

const initServer = async () => {
    const server = Hapi.server(serverConfig);

    // Register JWT Auth plugin
    await server.register(authJwt2);

    server.auth.strategy('jwt', 'jwt', jwtConfig);

    server.auth.default('jwt');

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