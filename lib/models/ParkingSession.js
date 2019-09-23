import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const parkingSessionSchema = new Schema({
    vehicleIdentifier: {
        type: Schema.Types.String,
        minLength: 3
    },
    vehicleIdentifierType: {
        type: Schema.Types.String,
        enum: ['IU Number', 'License Plate', 'CashCard CAN ID']
    },
    vehicleType: {
        type: Schema.Types.String,
        enum: ['Car', 'Motorcycle']
    },
    sessionType: {
        type: Schema.Types.String,
        enum: ['Hourly', 'Season', 'Preferential', 'Complimentary']
    },
    entryTimestamp: {
        type: Schema.Types.Date
    },
    exitTimestamp: {
        type: Schema.Types.Date
    },
    isVehicleRegisteredToSpot: {
        type: Schema.Types.Boolean
    },
    currentCharge: {
        type: Schema.Types.Decimal128
    }
}, {
    autoCreate: true,
    strict: true,
    strictQuery: true,
    timestamps: true
});

const ParkingSession = mongoose.model('ParkingSession', parkingSessionSchema, 'parking_sessions');

export default ParkingSession;