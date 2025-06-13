const express = require('express');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const { validacionLogin } = require('./validaciones'); 
const validarCampos = require('../../middleware/validacionResultados'); 

const router = express.Router();

router.post('/login', validacionLogin, validarCampos, login);

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    
    const result = await controlador.login(username, password);
    respuestas.success(req, res, result, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = router;
