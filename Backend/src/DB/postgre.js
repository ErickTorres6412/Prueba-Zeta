// db.js
const Postgre = require('pg');
const config = require('../config');

const dbConfig = {
    host: config.postgre.host,
    user: config.postgre.user,
    password: config.postgre.password,
    database: config.postgre.database,
    port: config.postgre.port
}

let conexion;

function conectar() {
    conexion = new Postgre.Client(dbConfig);

    conexion.connect(err => {
        if (err) {
            console.error('Error connecting to PostgreSQL:', err);
        } else {
            console.log('Connected to PostgreSQL');
        }
    });

    conexion.on('error', err => {
        console.error('PostgreSQL connection error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnecting to PostgreSQL...');
            conectar();
        } else {
            throw err;
        }
    });
}

conectar();

function todos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

function uno(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id = $1`, [id], (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

function agregar(tabla, data) {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
        const columns = keys.join(', ');
        
        const query = `INSERT INTO ${tabla} (${columns}) VALUES (${placeholders}) RETURNING *`;
        
        conexion.query(query, values, (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

function actualizar(tabla, data) {
    console.log('Actualizando datos:', data);
    return new Promise((resolve, reject) => {
        // Separar el id del resto de los datos
        const { id, ...updateData } = data;
        const keys = Object.keys(updateData);
        const values = Object.values(updateData);
        
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        
        values.push(id);
        
        const query = `UPDATE ${tabla} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
        
        conexion.query(query, values, (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

function eliminar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = $1 RETURNING *`, [data.id], (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

// Función para consultas personalizadas
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    actualizar,
    query,
};