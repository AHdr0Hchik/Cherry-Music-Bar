const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          });
    }

    async sendActivationLink(to, link) {
        try {
            await this.transporter.sendMail({
                from: 'xomenko-andrey2201@yandex.ru',
                to: to,
                subject: `Активация аккаунта на сайте ${process.env.API_URL}`,
                html: `
                  <h1>Для активации перейдите по ссылке</h1>
                  <a href="${link}">${link}</a>
                `
            });
        } catch(e) {
            console.log(e);
        }
    }

    async sendConfirmCode(to, code) {
        try {
            await this.transporter.sendMail({
                from: 'xomenko-andrey2201@yandex.ru',
                to: to,
                subject: `Восстановление пароля на сайте ${process.env.API_URL}`,
                html: `
                  <h1>Код подтверждения для восстановления пароля. Никому не сообщайте его.</h1>
                  <p>${code}</p>
                  <h3>Сообщение отправлено ботом, не нужно на него отвечать.</h3>
                `
            });
        } catch(e) {
            console.log(e);
        }
    }
}
module.exports = MailService;