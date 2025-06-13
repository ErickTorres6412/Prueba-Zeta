const express = require('express');

const respuestas = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

router.post('/login', login);

async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return respuestas.error(req, res, 'Username y password son requeridos', 400);
        }
        
        const result = await controlador.login(username, password);
        respuestas.success(req, res, result, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = router;