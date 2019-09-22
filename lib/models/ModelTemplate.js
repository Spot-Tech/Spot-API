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
    }
}, {
    autoCreate: true,
    strict: true,
    strictQuery: true,
    timestamps: true
});

// TODO Always declare the (1) model name, (2) schema and (3) collection name.
// Model name should be in Title Case.
// Collection name should be in snake_case.
const ModelTemplate = mongoose.model('ModelTemplate', oauthClientSchema, 'model_template');

export default ModelTemplate;