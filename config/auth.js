import _ from 'lodash';
import Boom from '@hapi/boom';

import models from '../lib/models';

export default {
    accessTokenName: 'access_token',
    allowQueryToken: false,
    allowCookieToken: false,
    validate: async (request, token, h) => {

        const tokenInDb = await models.AccessToken.findOne({ accessToken: token });

        const isValid = !_.isNil(tokenInDb) && token === tokenInDb.accessToken;

        const credentials = { token };
        const artifacts = _.cloneDeep(tokenInDb.metadata);

        return { isValid, credentials, artifacts };
    }
};