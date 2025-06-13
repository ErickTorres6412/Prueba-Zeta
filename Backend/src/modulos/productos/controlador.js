const TABLA = 'productos';

module.exports = function (dbinyectada) {
    
    let db = dbinyectada;

    if (!db) {
        db = require('../../DB/postgre');
    }
    
    async function todos() {
        const resultados = await db.query(`
        SELECT 
            p.id,
            p.nombre,
            p.descripcion,
            p.precio,
            p.url_imagen,
            p.created_at,
            p.updated_at,
            c.id AS categoria_id,
            c.nombre AS categoria_nombre,
            c.descripcion AS categoria_descripcion
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        ORDER BY p.id;
    `);

        return resultados.map(p => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            url_imagen: p.url_imagen,
            created_at: p.created_at,
            updated_at: p.updated_at,
            categoria: {
                id: p.categoria_id,
                nombre: p.categoria_nombre,
                descripcion: p.categoria_descripcion
            }
        }));
    };

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