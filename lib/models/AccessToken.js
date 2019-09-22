import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accessTokenSchema = new Schema({
    accessToken: {
        type: Schema.Types.String,
        minLength: 8,
        maxLength: 32
    },
    expiresIn: {
        type: Schema.Types.Number,
        min: 3600,
        max: 2592000
    },
    expiresOn: {
        type: Schema.Types.Date
    },
    tokenType: {
        type: Schema.Types.String,
        enum: ['Bearer']
    }
}, {
    autoCreate: true,
    strict: true,
    strictQuery: true,
    timestamps: true
});

const AccessToken = mongoose.model('AccessToken', accessTokenSchema, 'access_token');

export default AccessToken;