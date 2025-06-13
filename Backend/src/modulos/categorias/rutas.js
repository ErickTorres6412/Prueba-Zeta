const express = require('express');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const { soloAdmin, adminOUser } = require('../../auth/seguridad');
const {
  validacionAgregarCategoria,
  validacionActualizarCategoria,
  validacionEliminarCategoria,
  validacionObtenerCategoria
} = require('./validaciones');
const validarCampos = require('../../middleware/validacionResultados');

const router = express.Router();

router.get('/', adminOUser(), todos);
router.get('/:id', adminOUser(), validacionObtenerCategoria, validarCampos, uno);
router.delete('/', soloAdmin(), validacionEliminarCategoria, validarCampos, eliminar);
router.post('/', soloAdmin(), validacionAgregarCategoria, validarCampos, agregar);
router.put('/', soloAdmin(), validacionActualizarCategoria, validarCampos, actualizar);


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
            mensaje = 'Categoria agregada correctamente';
        } else {
            mensaje = 'Categoria actualizada correctamente';
        }

        respuestas.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
    }
};

async function actualizar(req, res, next) {
    try {
        await controlador.actualizar(req.body);
        let mensaje = 'Categoria actualizada correctamente';
        respuestas.success(req, res, mensaje, 201);
    } catch (error) {
        next(error);
    }
};

async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuestas.success(req, res, 'Categoria eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;