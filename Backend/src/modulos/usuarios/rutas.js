const express = require('express');

const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const { soloAdmin } = require('../../auth/seguridad');  

const router = express.Router();

router.get('/', soloAdmin(), todos);
router.get('/:id', soloAdmin(), uno);
router.delete('/', soloAdmin(), eliminar);
router.put('/', soloAdmin(), actualizar);
router.post('/', agregar);

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
        const mensaje = items ? 'Usuario agregado correctamente' : 'Error al agregar el usuario';

        respuestas.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
    }
};

async function actualizar(req, res, next) {
    try {
        const items = await controlador.actualizar(req.body);
        respuestas.success(req, res, 'Usuario actualizado correctamente', 200);
    } catch (error) {
        next(error);
    }
};

async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuestas.success(req, res, 'Usuario eliminado correctamente', 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;