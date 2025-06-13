const db = require ('../../DB/postgre');
const ctrl = require('./controlador');

module.exports = ctrl(db);