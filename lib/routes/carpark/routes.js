import _ from 'lodash';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import moment from 'moment';
import uuid from 'uuid';

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'GET',
        path: '/{carparkId}/parking-session/{sessionId?}/',
        options: {
            auth: 'bearer',
            validate: {
                payload: Joi.object({
                    vehicle_identifier: Joi.string().trim().required(true).min(3),
                    vehicle_identifier_type: Joi.string().trim().required(true).valid('IU Number', 'License Plate', 'CashCard CAN ID'),
                    vehicle_type: Joi.string().trim().required(true).valid('Car', 'Motorcycle'),
                    session_type: Joi.string().trim().required(true).valid('Hourly', 'Season', 'Preferential', 'Complimentary '),
                    entry_timestamp: Joi.string().trim().isoDate(),
                    exit_timestamp: Joi.string().trim().isoDate()
                })
            }
        },
        handler: (request, h) => {
            return {
                carparkId: request.params.carparkId,
                sessionId: request.params.sessionId ? request.params.sessionId : "what"
            };
        }
    },
];