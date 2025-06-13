const e = require('express');
const auth = require('../auth/index');

const TABLA = 'usuarios';

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

    function actualizar(body) {
        return db.actualizar(TABLA, body);
    }

    async function agregar(body) {
        try {
            // Separar datos de usuario y autenticación
            const { username, password, role, ...userData } = body;
            
            // Agregar usuario primero
            const usuarioResult = await db.agregar(TABLA, userData);

           let insertedId = usuarioResult[0].id;

            // Si se proporcionan datos de autenticación, crear registro en auth
            if (username && password) {
                await auth.agregar({
                    user_id: insertedId,
                    username: username,
                    password: password,
                    role: role || 'user'
                });
            }

            return true;
            
        } catch (error) {
            console.error('Error en agregar usuario:', error);
            throw error;
        }
    }

    return {
        todos,
        uno,
        eliminar,
        agregar,
        actualizar
    }
};