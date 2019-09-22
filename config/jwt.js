export default {
    key: `${process.env.APP_SECRET ? process.env.APP_SECRET : '5q],bkcp?cgsdK=j}[?dFeA#YpE@}'}`,
    verifyOptions: { algorithms: [ 'HS256' ] },
    validate: (decoded, request) => {
        console.log(`Decoded JWT : ${JSON.stringify(decoded, null, 4)}`);

        return { isValid: true };
    }
};