const TABLA = 'auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth');
const errors = require('../../middleware/errors');

module.exports = function (dbinyectada) {
    
    let db = dbinyectada;

    if (!db) {
        db = require('../../DB/postgre');
    }

    async function login(username, password) {
        try {
            const result = await db.query(`SELECT * FROM ${TABLA} WHERE username = $1`, [username]);
            
            if (result.length === 0) {
                throw new errors('Credenciales incorrectas', 401);
            }
            
            const data = result[0];
            
            const resultado = await bcrypt.compare(password, data.password);
            
            if (resultado === true) {
                const tokenPayload = {
                    id: data.id,
                    user_id: data.user_id,
                    username: data.username,
                    role: data.role
                };
                
                const token = auth.asignarToken(tokenPayload);
                
                return {
                    token: token,
                    user: {
                        username: data.username,
                        role: data.role,
                        user_id: data.user_id
                    }
                };
            } else {
                throw new errors('Credenciales incorrectas', 401);
            }
        } catch (error) {
            throw error;
        }
    }

    async function agregar(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const authData = {
            user_id: data.user_id, 
            username: data.username, 
            password: hashedPassword,
            role: data.role || 'user'
        };

        return db.agregar(TABLA, authData);
    }

    return {
        login,
        agregar,
    }
};