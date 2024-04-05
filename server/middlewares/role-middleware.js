const ApiError = require('../classes/exceptions/api-error');
const Token = require('../classes/Token');


module.exports = async function(req, res, next) {
    try {
        const {refreshToken} = req.cookies;
        const {role} = await new Token().decodeToken(refreshToken);
        const personal_roles = process.env.PERSONAL_ROLES.split(', ');
        if(!personal_roles.includes(role)) {
            return next(ApiError.NoPermissions());
        }
        next();
    } catch(e) {
        console.log(e);
        throw ApiError.BadRequest('Произошла неизвестная ошибка', e);
    }
}