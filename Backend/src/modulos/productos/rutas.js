const express = require('express');

const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const { soloAdmin, adminOUser } = require('../../auth/seguridad'); 

const router = express.Router();

router.get('/', adminOUser(), todos);
router.get('/:id', adminOUser(), uno);
router.delete('/', soloAdmin(), eliminar);
router.post('/', soloAdmin(), agregar);
router.put('/', soloAdmin(), actualizar); // Usamos el mismo controlador para agregar y actualizar

async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function uno(req, res, next) {
    try {
        const items = await controlador.uno(req.params.id);
        respuestas.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
};

async function agregar(req, res, next) {
    try {
        const items = await controlador.agregar(req.body);
        if(req.body.id == 0) {
            mensaje = 'Producto agregado correctamente';
        } else {
            mensaje = 'Item actualizado correctamente';
        }

        respuestas.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
    }
};

async function actualizar(req, res, next) {
    try {
        await controlador.actualizar(req.body);
        let mensaje = 'Producto actualizado correctamente';
        respuestas.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
    }
};

async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuestas.success(req, res, 'Producto eliminado correctamente', 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;