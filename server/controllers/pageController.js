const Database = require('../classes/Database');
const path = require('path');
const User = require('../classes/User');
const MailService = require('../classes/MailService');
const bcrypt = require('bcryptjs');
const Model = require('../models');

const db = new Database;

const createPath = (page) => path.resolve(__dirname, '../../public', `${page}.ejs`);

//main pages
exports.index = async (req, res) => { 
    const [categories] = await db.connection.promise().query(`SELECT * FROM menu_categories WHERE hidden="0"`);
    if(!req.cookies.refreshToken) {
       res.render(createPath('index'), {categories: categories, isAuthorized: false});
    } else {
       res.render(createPath('index'), {categories: categories, isAuthorized: true});
    }
};

exports.subcategories = async (req, res) => {
    const this_category = await Model.categories.findOne({
        where: { id: req.query.category_id }
    })
    if(this_category.is_forSite == 0 || this_category.hidden == 1) {
        return res.redirect('/');
    }
    const [subcategories] = await db.connection.promise().query(`SELECT * FROM menu_subcategories WHERE category=${req.query.category_id}`);
    if(!req.cookies.refreshToken) {
       res.render(createPath('subcategories'), {subcategories: subcategories, isAuthorized: false});
    } else {
       res.render(createPath('subcategories'), {subcategories: subcategories, isAuthorized: true});
    }
}

exports.menu = async (req, res) => {
   
    const menuList = await Model.menu.findAll(
        {
            where:{
                subcategory: req.query.subcategory_id,
                is_forSite: 1
            }
        },
        {
            order: ['name']
        }
    );
    const pricelist = await Model.pricelist.findAll({
        order: ['dish_id', 'size']
    });
    
    const stoplist = await Model.stoplist.findAll();

    if(!req.cookies.refreshToken) {
       if(req.query.subcategory_id != 11) {
          res.render(createPath('menu'), {menu: menuList, pricelist: pricelist, isAuthorized: false, stopllist: stoplist});
       } 
    } else {
          res.render(createPath('menu'), {menu: menuList, pricelist: pricelist, isAuthorized: true, stoplist: stoplist});
    }
}

//auth pages
exports.login = async (req, res) => {
    const {refreshToken} = req.cookies;
         console.log(refreshToken);
         if(refreshToken) {
             return res.redirect('/');
         }
    return res.render(createPath('login'), {message: ''});
}

exports.register = async (req, res) => {
    res.render(createPath('register'), {message: ''});
}

exports.profile = async (req, res) => {
    const {refreshToken} = req.cookies;
    const user = new User();
    const [id] = await db.connection.promise().query('SELECT userId FROM Tokens WHERE refreshToken = ?;', [refreshToken]);
    const dto = await user.getUserById(id[0].userId);
    console.log(dto);
    res.render(createPath('profile'), {user: dto, isAuthorized: true});

}

exports.forgot_password = async (req, res) => {
    const mailService = new MailService;
    const email = req.cookies.email;
    const confirmCode = Math.round(Math.random() * 32768).toString();

    await mailService.sendConfirmCode(email, confirmCode);
    const hashedCode = await bcrypt.hash(confirmCode, 8);
    res.cookie('hashedCode', hashedCode, {maxAge: 1000*60*15});
    res.render(createPath('forgot_password'), {email : email});
}


