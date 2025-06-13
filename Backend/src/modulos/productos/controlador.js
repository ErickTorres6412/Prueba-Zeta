const TABLA = 'productos';

module.exports = function (dbinyectada) {
    
    let db = dbinyectada;

    if (!db) {
        db = require('../../DB/postgre');
    }
    
    function todos() {
        return db.todos(TABLA)
    }

    function uno(id) {
        return db.uno(TABLA, id);
    }

    function eliminar(body) {
        return db.eliminar(TABLA, body);
    }

    function agregar(body) {
        return db.agregar(TABLA, body);
    }

    function actualizar(body) {
        return db.actualizar(TABLA, body);
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    }
};