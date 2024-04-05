const jwt = require('jsonwebtoken');
const Database = require('./Database');
const ApiError = require('./exceptions/api-error');


class Token {

    async generateTokens(payload) {
        try{
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '12h'});
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
            return {accessToken, refreshToken};
        } catch(e) {
            console.log(e);
            return false;
        }
        
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async saveToken(userId, refreshToken) {
        try{
            const db = new Database;
            const [tokenData] = await db.connection.promise().query('SELECT userId from Tokens where userId=? and refreshToken = ?', [userId, refreshToken]);
            if(tokenData.length>0) {
                Database.connection.promise().query('UPDATE Tokens SET refreshToken = ? WHERE userId = ?', [refreshToken, userId]);
            } else if(tokenData.length === 0) {
                await db.connection.promise().query('INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)', [userId, refreshToken]);
            }
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async deleteToken(refreshToken) {
        try{
            const db = new Database; 
            return await db.connection.promise().query('DELETE FROM Tokens WHERE refreshToken = ?', [refreshToken]);;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async decodeToken(token) {
        try {
            const userData = jwt.decode(token);
            return userData;
        } catch(e) {
            console.log(e);
        }
    }
    
    async findToken(token) {
        try{
            const db = new Database;
            const [tokenData] = await db.connection.promise().query('SELECT refreshToken from Tokens where refreshToken = ?', [token]);
            if(tokenData.length===0) return false;
            return tokenData[0];
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}
module.exports = Token;