const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const error = require('./red/errors');
const cors = require('cors');

const productos = require('./modulos/productos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas');
const categorias = require('./modulos/categorias/rutas');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Configuracion
app.set('port', config.app.port);

app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//rutas
app.use('/api/productos', productos);
app.use('/api/usuarios', usuarios)
app.use('/api/auth', auth);
app.use('/api/categorias', categorias);

app.use(error);

module.exports = app;