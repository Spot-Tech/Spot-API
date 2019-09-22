export default {
    uri: `${process.env.DB_URI ? process.env.DB_URI : 'mongodb://localhost:27017/spot'}`,
    options: {
        autoIndex: true, // Should turn off after Beta testing or for tuning
        useNewUrlParser: true,
        useCreateIndex: true,
    }
};