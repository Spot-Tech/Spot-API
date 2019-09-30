module.exports = {
    apps : [{
        name: 'Spot on Site',
        script: 'index.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            DB_URI: 'mongodb://localhost:27017/spot',
            PORT: 8080
        },
        env_production: {
            NODE_ENV: 'production',
            DB_URI: 'mongodb://localhost:27017/spot',
            PORT: 8080
        }
    }],

    // deploy : {
    //     production : {
    //         user : 'node',
    //         host : '212.83.163.1',
    //         ref  : 'origin/master',
    //         repo : 'git@github.com:repo.git',
    //         path : '/var/www/production',
    //         'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    //     }
    // }
};