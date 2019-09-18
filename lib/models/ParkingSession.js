import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const parkingSessionSchema = new Schema({
    vehicle_identifier: {
        type: Schema.Types.String,
        minLength: 3
    },
    vehicle_identifier_type: {
        type: Schema.Types.String,
        enum: ['IU Number', 'License Plate', 'CashCard CAN ID']
    },
    vehicle_type: {
        type: Schema.Types.String,
        enum: ['Car', 'Motorcycle']
    },
    session_type: {
        type: Schema.Types.String,
        enum: ['Hourly', 'Season', 'Preferential', 'Complimentary']
    },
    entry_timestamp: {
        type: Schema.Types.Date
    },
    exit_timestamp: {
        type: Schema.Types.Date
    },
    is_vehicle_registered_to_spot: {
        type: Schema.Types.Boolean
    },
    current_charge: {
        type: Schema.Types.Decimal128
    }
}, {
    autoCreate: true,
    strict: true,
    strictQuery: true,
    timestamps: true
});

const ParkingSession = mongoose.model('ParkingSession', parkingSessionSchema);

export default ParkingSession;