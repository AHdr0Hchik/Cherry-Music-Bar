const Database = require('./Database');
const MailService = require('./MailService');
const Token = require('./Token');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const ApiError = require('./exceptions/api-error');
const Model = require('../models');

class User {
    constructor(firstname, lastname, email, password) {
        this.firstname = firstname,
        this.lastname = lastname,
        this.email = email,
        this.password = password
    }
    phoneNumber = '';
    role = '';
    dateOfReg = new Date();
    isActive = false;

    async Firstname(firstname) {
        if(!firstname) console.log(this.firstname);
        else this.firstname = firstname;
    }
    async Lastname(lastname) {
        if(!lastname) console.log(this.lastname);
        else this.lastname = lastname;
    }
    async Email(email) {
        if(!email) console.log(this.email);
        else this.email = email;
    }
    async Password(password) {
        if(!password) console.log(this.password);
        else this.password = password;
    }
    async PhoneNumber(phoneNumber) {
        if(!phoneNumber) console.log(this.phoneNumber);
        else this.phoneNumber = phoneNumber;
    }
    async Role(role) {
        if(!role) console.log(this.role);
        else this.role = role;
    }

    db = new Database;
    //добавление юзера в бд
    async addToDatabase(uuid) {  
        await this.db.connection.promise().query('INSERT INTO users (firstname, lastname, email, password, date_of_reg, uuid) VALUES (?, ?, ?, ?, ?, ?);', [this.firstname, this.lastname, this.email, this.password, this.dateOfReg, uuid]);
        return true;
    }

    //создание юзера
    async createUser() {
        try {
            const token = new Token;
            const mailService = new MailService;

            const activationLink = uuid.v4();
            await this.addToDatabase(activationLink);

            const userDto = await this.getUserByEmail(this.email);
            const tokens = await token.generateTokens(userDto);
            await token.saveToken(userDto.id, tokens.refreshToken);
            await mailService.sendActivationLink(this.email, `${process.env.API_URL}/auth/activate/${activationLink}`);
            
            return {...tokens, user: userDto};
        } catch(e) {
            console.log(e);
            return false;
        }
    }
    //аутнетификация и jwt
    async login(email, password) {
        const [user] = await this.db.connection.promise().query('SELECT * FROM Users WHERE email=?', [email]);
        if(user.length===0) {
            return false;
        }
        const isPassEquals = await bcrypt.compare(password, user[0].password);
        if(!isPassEquals) {
            return false;
        }
        const token = new Token;

        const userDto = await this.getUserByEmail(email);
        const tokens = await token.generateTokens({...userDto});
        await token.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async logout(refreshToken) {
        try{
            const token = await new Token().deleteToken(refreshToken);
            return token;
        } catch(e) {
            return false
        }
    }

    async refresh(refreshToken) {
        try{
            const token = new Token;
            if(!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = token.validateRefreshToken(refreshToken);
            const tokenFromDB = await token.findToken(refreshToken);
            if(!userData || !tokenFromDB) {
                throw ApiError.UnauthorizedError();
            }

            const userDto = await this.getUserByEmail(email);
            const tokens = await token.generateTokens({...userDto});
            await token.deleteToken(refreshToken);
            await token.saveToken(userDto.id, tokens.refreshToken);

            return {...tokens, user: userDto};
        } catch(e) {
            return false
        }
    }

    async forgotPassword (email, newPassword, inputCode, hashedCode) {
        if(!bcrypt.compare(inputCode, hashedCode) ) {
            return false
        }
        const user = await this.getUserByEmail(email);
        if(!user) {
            return false;
        }
        this.email = email;
        this.password = newPassword;
        if(!await this.updatePassword()) {
            return ApiError.UnknownError();
        }
        return true;
    }
    //получение юзера
    async getUserByEmail(email2) {
        try {
            const user = await Model.users.findOne({
                where: { email: email2 }
            });
            
            const id = user.id;
            const role = user.role
            const email = user.email;
            const isActive = user.isActive;
            const firstname = user.firstname;
            const lastname = user.lastname;
            
            return {id, role, firstname, lastname, email, isActive};
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async getUserById(id2) {
        try {
            const [user] = await this.db.connection.promise().query('SELECT * FROM users WHERE id=?', [id2]);
            
            const id = user[0].id;
            const role = user[0].role
            const email = user[0].email;
            const isActive = user[0].isActive;
            const firstname = user[0].firstname;
            const lastname = user[0].lastname;
            const address = user[0].address;
            const phoneNumber = user[0].phone_number;
            
            return {id, role, firstname, lastname, email, phoneNumber, address, isActive};
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    async getAllUsers() {
        try {
            const [users] = await this.db.connection.promise().query('SELECT * FROM users');
            return users;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
    // задел на будущее (функции личного кабинета)
    async updatePhoneNumber() {
        try {
            await this.db.connection.promise().query('UPDATE users SET phone_number=? where email=?', [this.phoneNumber, this.email]);
            return true;
        } catch {
            return false;
        }
        
    }
    async updateEmail() {
        try {
            await this.db.connection.promise().query('UPDATE users SET email=? where email=?', [this.email, this.email]);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
    async updatePhoneNumber() {
        await this.db.connection.promise().query('UPDATE users SET phone_number=? where email=?', [this.phoneNumber, this.email]);
        return true
    }
    async updatePassword() {
        await this.db.connection.promise().query('UPDATE users SET password=? where email=?', [await bcrypt.hash(this.password, 3), this.email]);
        return true;
    }
    async updateRole() {
        await this.db.connection.promise().query('UPDATE users SET role=? where email=?', [this.role, this.email]);
        return true
    }
}
module.exports = User;