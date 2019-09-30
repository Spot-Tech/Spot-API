import _ from 'lodash';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import moment from 'moment';
import uuid from 'uuid';

import models from '../../models';

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'POST',
        path: '/{carparkId}/parking-session/{sessionId?}/',
        options: {
            auth: 'bearer',
            validate: {
                params: Joi.object({
                    carparkId: Joi.string().trim().required(true).alphanum(),
                    sessionId: Joi.string().trim().required(false).alphanum(),
                }),
                payload: Joi.object({
                    vehicle_identifier: Joi.string().trim().required(true).min(3),
                    vehicle_identifier_type: Joi.string().trim().required(true).valid('IU Number', 'License Plate', 'CashCard CAN ID'),
                    vehicle_type: Joi.string().trim().required(false).valid('Car', 'Motorcycle'),
                    session_type: Joi.string().trim().required(true).valid('Hourly', 'Season', 'Preferential', 'Complimentary '),
                    entry_timestamp: Joi.string().trim().isoDate(),
                    exit_timestamp: Joi.string().trim().isoDate()
                }).options({
                    stripUnknown: true
                })
            }
        },
        handler: (request, h) => {
            // TODO Check if carpark ID matches the permission artifact.
            // if (true) {
            //     // TODO
            // }

            if (!_.isNil(request.params.sessionId)) {
                // If session ID is provided, we'll need to pull out the referenced session.
                return models.ParkingSession
                    .findById(request.params.sessionId)
                    .then(
                        parkingSession => {
                            if (!_.isNil(parkingSession)) {
                                const updatedParkingSession = _.merge({}, parkingSession, {
                                    vehicleIdentifier: request.payload['vehicle_identifier'],
                                    vehicleIdentifierType: request.payload['vehicle_identifier_type'],
                                    vehicleType: request.payload['vehicle_type'],
                                    sessionType: request.payload['session_type'],
                                    entryTimestamp: request.payload['vehicle_identifier'],
                                    exitTimestamp: request.payload['vehicle_identifier']
                                });

                                return models.ParkingSession
                                    .replaceOne({ _id: updatedParkingSession.id }, updatedParkingSession)
                            }

                            return Boom.badRequest('Invalid parking session ID');
                        },
                        error => {
                            throw error;
                        }
                    ).then(
                        updatedParkingSession => {
                            return {
                                id: updatedParkingSession.id,
                                vehicle_identifier: updatedParkingSession.vehicleIdentifier,
                                vehicle_identifier_type: updatedParkingSession.vehicleIdentifierType,
                                vehicle_type: updatedParkingSession.vehicleType,
                                session_type: updatedParkingSession.sessionType,
                                entry_timestamp: updatedParkingSession.entryTimestamp,
                                exit_timestamp: updatedParkingSession.exitTimestamp,
                                is_vehicle_registered_to_spot: updatedParkingSession.isVehicleRegisteredToSpot,
                            }
                        },
                        error => {
                            throw error;
                        }
                    ).catch(error => {
                        return Boom.badImplementation('Database Op error', error);
                    });
            } else {
                const newParkingSession = new models.ParkingSession({
                    vehicleIdentifier: request.payload['vehicle_identifier'],
                    vehicleIdentifierType: request.payload['vehicle_identifier_type'],
                    vehicleType: request.payload['vehicle_type'],
                    sessionType: request.payload['session_type'],
                    entryTimestamp: request.payload['entry_timestamp'],
                    exitTimestamp: request.payload['exit_timestamp']
                });

                return newParkingSession
                    .save()
                    .then(
                        newParkingSession => {
                            return {
                                id: newParkingSession.id,
                                vehicle_identifier: newParkingSession.vehicleIdentifier,
                                vehicle_identifier_type: newParkingSession.vehicleIdentifierType,
                                vehicle_type: newParkingSession.vehicleType,
                                session_type: newParkingSession.sessionType,
                                entry_timestamp: newParkingSession.entryTimestamp,
                                exit_timestamp: newParkingSession.exitTimestamp,
                                is_vehicle_registered_to_spot: newParkingSession.isVehicleRegisteredToSpot,
                            }
                        },
                        error => {
                            throw error;
                        }
                    ).catch(error => {
                        return Boom.badImplementation('Database Op error', error);
                    });
            }
        }
    },
];