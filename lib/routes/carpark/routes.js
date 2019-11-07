import _ from 'lodash';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import moment from 'moment';
import models from '../../models';

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'POST',
        path: '/{carparkId}/parking-session/{sessionId?}',
        options: {
            auth: 'bearer',
            validate: {
                params: Joi.object({
                    carparkId: Joi.string().trim().required().alphanum(),
                    sessionId: Joi.string().trim().alphanum(),
                }),
                payload: Joi.object({
                    vehicle_identifier: Joi.string().trim().required().min(3),
                    vehicle_identifier_type: Joi.string().trim().required().valid('IU Number', 'License Plate', 'CashCard CAN ID'),
                    vehicle_type: Joi.string().trim().valid('Car', 'Motorcycle'),
                    session_type: Joi.string().trim().required().valid('Hourly', 'Season', 'Preferential', 'Complimentary'),
                    entry_timestamp: Joi.date().iso(),
                    exit_timestamp: Joi.date().iso()
                }).options({
                    stripUnknown: true
                })
            }
        },
        handler: (request, h) => {
            if (!_.isNil(request.params.sessionId)) {
                // If session ID is provided, we'll need to pull out the referenced session.
                return models.ParkingSession
                    .findById(request.params.sessionId)
                    .then(
                        parkingSession => {
                            if (!_.isNil(parkingSession)) {
                                const updatedParkingSession = _.merge({}, parkingSession.toObject(), {
                                    vehicleIdentifier: request.payload['vehicle_identifier'],
                                    vehicleIdentifierType: request.payload['vehicle_identifier_type'],
                                    vehicleType: request.payload['vehicle_type'],
                                    sessionType: request.payload['session_type'],
                                    entryTimestamp: request.payload['entry_timestamp'],
                                    exitTimestamp: request.payload['exit_timestamp']
                                });

                                if (!_.isNil(updatedParkingSession.exitTimestamp)) {
                                    const momentOfEntry = moment(updatedParkingSession.entryTimestamp);
                                    const momentOfExit = moment(updatedParkingSession.exitTimestamp);

                                    if (!momentOfEntry.isBefore(momentOfExit)) {
                                        return Boom.badRequest('Invalid exit timestamp');
                                    }

                                    if (updatedParkingSession.isVehicleRegisteredToSpot) {
                                        const sessionLengthMinutes = momentOfExit.diff(momentOfEntry, 'minutes');

                                        if (_.isNil(updatedParkingSession.currentCharge)) {
                                            updatedParkingSession.currentCharge = 0;
                                        }

                                        updatedParkingSession.currentCharge += _.round(sessionLengthMinutes * 0.02, 2);
                                    }
                                }

                                return models.ParkingSession
                                    .findByIdAndUpdate(updatedParkingSession._id, updatedParkingSession, { lean: true })
                            }

                            return Boom.badRequest('Invalid parking session ID');
                        },
                        error => {
                            throw error;
                        }
                    ).then(
                        updatedParkingSession => {
                            if (_.isNil(updatedParkingSession)) {
                                return Boom.badRequest('Invalid parking session ID');
                            }

                            return {
                                id: updatedParkingSession._id,
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

                if (newParkingSession.vehicleIdentifierType === 'IU Number' && _.includes(['1128796092', '1042543321', '1234567890'], newParkingSession.vehicleIdentifier)) {
                    newParkingSession.isVehicleRegisteredToSpot = true;
                    newParkingSession.currentCharge = 0.5;
                }

                return newParkingSession
                    .save()
                    .then(
                        newParkingSession => {
                            return {
                                id: newParkingSession._id,
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