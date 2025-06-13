const TABLA = 'auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth');

module.exports = function (dbinyectada) {
    
    let db = dbinyectada;

    if (!db) {
        db = require('../../DB/postgre');
    }

    async function login(username, password) {
        try {
            const result = await db.query(`SELECT * FROM ${TABLA} WHERE username = $1`, [username]);
            
            if (result.length === 0) {
                throw new Error('Credenciales incorrectas');
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
                throw new Error('Credenciales incorrectas');
            }
        } catch (error) {
            throw error;
        }
    }

    async function agregar(data) {
        // Hashear la contraseña antes de guardarla
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