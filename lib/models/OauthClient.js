import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const oauthClientSchema = new Schema({
    clientId: {
        type: Schema.Types.String,
        minLength: 8,
        maxLength: 32
    },
    clientSecret: {
        type: Schema.Types.String,
        minLength: 8,
        maxLength: 32
    },
    grantType: {
        type: Schema.Types.String,
        enum: ['Client Credentials']
    },
    carparks: [Schema.Types.ObjectId]
}, {
    autoCreate: true,
    strict: true,
    strictQuery: true,
    timestamps: true
});

const OauthClient = mongoose.model('OauthClient', oauthClientSchema, 'oauth_clients');

export default OauthClient;