import serverConfig from "./config/server.js";

import Hapi from "@hapi/hapi";

const init = async () => {
    const server = Hapi.server(serverConfig);

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();