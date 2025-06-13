require('dotenv').config();

module.exports = {
    app:{
        port: process.env.PORT || 4000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'llave_secreta',
    },
    postgre:{
        host: process.env.POSTGRE_HOST || 'localhost',
        user: process.env.POSTGRE_USER || 'postgres',
        password: process.env.POSTGRE_PASSWORD || '',
        database: process.env.POSTGRE_DATABASE || '',
        port: process.env.POSTGRE_PORT || 5432,
    }
}