Tienda de Tecnología - Plataforma E-commerce

Este proyecto es una plataforma e-commerce. Permite a los usuarios navegar un catálogo de productos tecnológicos, añadir productos al carrito, y a un administrador gestionar productos, categorías y usuarios desde un panel dedicado.

Descripción del Proyecto

La aplicación permite:
Registro e inicio de sesión con autenticación JWT.
Asignación automática del rol user al registrarse.
Solo el usuario admin (credenciales por defecto: admin / 12345678) puede crear nuevos usuarios.
Visualización de productos por parte de usuarios autenticados.
Agregado y eliminado de productos en el carrito.
Gestión completa de productos y categorías (crear, editar, eliminar, visualizar) por parte del administrador.
Visualización y edición de usuarios (nombre, apellidos, correo) por parte del administrador.

Tecnologías Utilizadas

Frontend
Next.js (con TypeScript)
React Context para manejo de estado global
TailwindCSS
Axios para consumo de API

Backend
Node.js
Express
Autenticación y autorización con JWT
PostgreSQL como base de datos
Middleware para control de roles y protección de rutas

Instrucciones para Ejecutar el Proyecto

Configuración del Backend:
Entrar al directorio del backend: cd backend
Instalar dependencias: npm install
Configurar archivo .env como el siguiente ejemplo: 
PORT = 4000
POSTGRE_HOST = localhost
POSTGRE_USER = postgres
POSTGRE_PASSWORD = root123
POSTGRE_DATABASE = ZetaPrueba
POSTGRE_PORT = 5432,
JWT_SECRET = llaveSecreta
Ejecutar el servidor: npm run dev

Configuración del Frontend
Entrar al directorio del frontend: cd frontend
Instalar dependencias: npm install
Configurar archivo .env.local: http://localhost:4000/api
Ejecutar el servidor de desarrollo: npm run dev

Roles del Sistema: 
Rol	    Permisos
admin	Gestión de productos, categorías, usuarios. Acceso completo al sistema.
user	Acceso al catálogo de productos y carrito de compras.