const Database = require('../classes/Database');
const User = require('../classes/User');
const bcrypt = require('bcryptjs');
const ApiError = require('../classes/exceptions/api-error');
const Token = require('../classes/Token');
const Model = require('../models');
const path = require('path');

const createPath = (page) => path.resolve(__dirname, '../../public', `${page}.ejs`);

const db = new Database;
const validateEmailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|aol|icloud|mail|yandex|live|gmx|protonmail|zoho|fastmail|tutanota|icloud|bk)\.[a-zA-Z]{2,}$/

exports.register = async (req, res, next) => {
    try {
        /*const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return next(ApiError.BadRequest('Произошла ошибка валидации', errors.array()));
        }*/
        const {refreshToken} = req.cookies;
        if(refreshToken) {
            return res.render('../../public/index');
        }

        const {firstname, lastname, email, password, passwordConfirm} = req.body;
        
        const [results] = await db.connection.promise().query('SELECT email FROM users WHERE email=?', [email] );
        if(results.length>0) {
            return res.render('../../public/register', {message : 'Аккаунт с такой почтой уже существует'});
        } else if(!validateEmailRegex.test(email)) {
            return res.render('../../public/register', {message : 'Почта введена неверно'});
        } else if(password.length<8) {
            return res.render('../../public/register', {message : 'Пароль меньше 8 символов'});
        } else if(password !== passwordConfirm) {
            return res.render('../../public/register', {message : 'Пароли не совпадают'});
        } else {
            let hashedPassword = await bcrypt.hash(password, 3);
            const user = new User(firstname, lastname, email, hashedPassword);
            const newUser = await user.createUser();
            return res.cookie('refreshToken', newUser.refreshToken, {maxAge : 1000 * 60* 60 * 24 * 30, httpOnly: true}), res.render('../../public/register', {message : 'Регистрация прошла успешно'});

        }
    } catch(e) {
        next(e);
    }
    
}

exports.admin_login = async (req, res) => {
    console.log(123)
    res.render(createPath('admin_login'));
}

exports.activate = async (req, res, next) => {
    try {
        const [results] = await db.connection.promise().query('SELECT uuid, isActive FROM users WHERE uuid=?', [req.params.link] );
        if(!results) {
            throw ApiError.BadRequest('Неверный код активации');
        } else if (results[0].isActive===1) {
            return res.render('../../public/register', {message : 'Аккаунт уже активирован'});
        }
        await db.connection.promise().query('UPDATE users SET isActive=1 where uuid = ?', [req.params.link] );
        return res.render('../../public/register', {message : 'Аккаунт активирован успешно'});
    
    } catch(e) {
        next(e);
    }

};

exports.login = async (req, res, next) => {
    try {
        const user = new User;
        const token = new Token;

        const {access_code} = req.body;
        let userDto;
        if(access_code) {
            console.log(123);
            const userId = await Model.workers.findOne(
                {
                    attributes: ['user_id']
                },
                {
                    where: { access_code: access_code}
                }
            )
            userDto = await user.getUserById(userId.user_id);
            const tokens = await token.generateTokens(userDto);
            const loginProcess = await user.loginByCode(access_code);
            if(!loginProcess) {
                return res.render('../../public/admin_login', {message : 'Введен неверный код доступа'});
            }
            return res.cookie('accessToken', tokens.accessToken, {maxAge: 1000*60*5}), res.cookie('refreshToken', tokens.refreshToken, {maxAge : 1000 * 60* 60 * 24 * 30, httpOnly: true}), res.redirect('/admin/tables');
        }
        console.log(456);
        const {email, password} = req.body;
        userDto = await user.getUserByEmail(email);
        const tokens = await token.generateTokens(userDto);
        const loginProcess = await user.login(email, password);
        if(!loginProcess) {
            return res.cookie('email', email, {maxAge: 1000*60*5}), res.render('../../public/login', {message : 'Введены неверные логин или пароль'});
        }
        return res.cookie('accessToken', tokens.accessToken, {maxAge: 1000*60*5}), res.cookie('refreshToken', tokens.refreshToken, {maxAge : 1000 * 60* 60 * 24 * 30, httpOnly: true}), res.redirect('/');
    } catch(e) {
        next(e);
    }

}

exports.refresh = async (req, res, next) => {
    try {
        const user = new User;

        const {refreshToken} = req.cookies;
        await user.refresh(refreshToken);
    } catch(e) {
        next(e);
    }
}

exports.logout = async (req, res, next) => {
    try {
        const user = new User;

        const {refreshToken} = req.cookies;
        if(!refreshToken) {
            return res.redirect('../login');
        }
        await user.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.redirect('/');
    } catch(e) {
        next(e);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const user = new User;
        return res.json(user.getAllUsers());
    } catch(e) {
        console.log(e);
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        const email = req.cookies.email;
        const inputCode = req.body.confirm_code;
        const newPassword = req.body.new_password;
        const hashedCode = req.cookies.hashedCode;
        
        if(newPassword.length<8) {
            return res.render('../../public/register', {message : 'Пароль меньше 8 символов'});
        }
        if(!await new User().forgotPassword(email, newPassword, inputCode, hashedCode)) {
            return ApiError.UnknownError();
        }
        return res.cookie('message', 'Пароль успешно изменён', {maxAge:1000*5}), res.redirect('/');
    } catch(e) {
        return ApiError.UnknownError();
    }
}

exports.updatePhoneNumber = async (req, res) => {
    try {
        const db = new Database;
        const refreshToken = req.cookies.refreshToken;
        const newPhoneNumber = req.body.newPhone;
        const user = await new Token().decodeToken(refreshToken);
        await db.connection.promise().query('UPDATE Users SET phone_number=? WHERE id=?', [newPhoneNumber, user.id]);
        return res.redirect('/profile');
    } catch(e) {
        return ApiError.UnknownError();
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const db = new Database;
        const refreshToken = req.cookies.refreshToken;
        const newAddress = req.body.newAddress;
        const user = await new Token().decodeToken(refreshToken);
        await db.connection.promise().query('UPDATE Users SET address=? WHERE id=?', [newAddress, user.id]);
        return res.redirect('/profile');
    } catch(e) {
        return ApiError.UnknownError();
    }
}