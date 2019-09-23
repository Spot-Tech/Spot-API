import _ from 'lodash';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import moment from 'moment';
import uuid from 'uuid';

// Models
import models from '../../../models';

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
                }).options({
                    stripUnknown: true
                })
            }
        },
        handler: (request, h) => {

            return models.OauthClient
                .findOne({
                    grant_type: request.payload.grantType,
                    clientId: request.payload.client_id,
                    clientSecret: request.payload.client_secret
                }).then(
                    oauthClient => {
                        if(!_.isNil(oauthClient)) {
                            return models.AccessToken.create({
                                accessToken: uuid.v4(),
                                expiresIn: 2592000, // TODO Do not use a magic number
                                expiresOn: moment().add(2592000, 'seconds'), // TODO Do not use a magic number
                                tokenType: 'Bearer',
                                metadata: {
                                    oauthClient: oauthClient._id,
                                    carparks: oauthClient.metadata.carparks
                                }
                            }).then(
                                accessToken => {
                                    if (!_.isNil(accessToken)) {
                                        return {
                                            access_token: accessToken.accessToken,
                                            expires_in: accessToken.expiresIn,
                                            expires_on: accessToken.expiresOn.toISOString(),
                                            token_type: accessToken.tokenType
                                        }
                                    }
                                },
                                error => {
                                    throw error;
                                }
                            )
                        }

                        return Boom.unauthorized(`Invalid client credentials`);
                    },
                    error => {
                        throw error;
                    }
                ).catch(error => {
                    return Boom.badImplementation('Database Op error', error);
                });
        }
    }
];