const ApiError = require('../classes/exceptions/api-error');
const Token = require('../classes/Token');

module.exports = function(req, res, next) {
    try {
        const token = new Token;
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            return res.redirect('/auth/admin_login');
        }
        const userData = token.validateRefreshToken(refreshToken);
        if(!userData) {
            return res.redirect('/auth/admin_login');
        }
        req.user = userData;
        next();
    } catch(e) {
        console.log(e);
        throw ApiError.UnauthorizedError();
    }
}