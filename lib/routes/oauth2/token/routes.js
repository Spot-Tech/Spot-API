import Joi from '@hapi/joi'
import serverConfig from "../../../../config/server";

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'POST',
        path: '/',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    grant_type: Joi.string().trim()
                        .required(true, `'grant_type' is a required field.`)
                        .valid('Client Credentials'),
                    client_id: Joi.string().trim()
                        .required(true, `'client_id' is a required field.`)
                        .min(8).max(32),
                    client_secret: Joi.string().trim()
                        .required(true, `'client_secret' is a required field.`)
                        .min(8).max(32)
                })
            }
        },
        handler: (request, h) => {
            console.log(`Request Body:\n${JSON.stringify(request.payload)}`);

            return {uri: serverConfig.uri, app: request.server.settings.app};
        }
    }
];