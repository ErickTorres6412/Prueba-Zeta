const express = require('express');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const { soloAdmin } = require('../../auth/seguridad');
const { validarUsuario, validarAuth, validarRegistro } = require('./validaciones');
const validarCampos = require('../../middleware/validacionResultados');

const router = express.Router();

router.get('/', soloAdmin(), todos);
router.get('/:id', soloAdmin(), uno);
router.delete('/', soloAdmin(), eliminar);

router.put('/', soloAdmin(), validarUsuario, validarCampos, actualizar);
router.post('/', soloAdmin(), validarUsuario, validarAuth, validarCampos, agregar);
router.post('/register', validarRegistro, validarCampos, register);

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

async function register(req, res, next) {
    try {
        if (req.body.role === 'admin') {
            return respuestas.error(req, res, 'No tienes permiso para registrar un rol diferente a "user".', 403);
        }

        const items = await controlador.agregar(req.body);
        const mensaje = items ? 'Usuario agregado correctamente' : 'Error al agregar el usuario';

        respuestas.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
    }
};

module.exports = router;