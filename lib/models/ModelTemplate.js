import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const modelTemplateSchema = new Schema({
    test: {
        type: Schema.Types.String,
        minLength: 1,
        maxLength: 32
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
const ModelTemplate = mongoose.model('ModelTemplate', modelTemplateSchema, 'model_template');

export default ModelTemplate;