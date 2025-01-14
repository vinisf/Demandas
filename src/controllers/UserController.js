
const User = require("../models/User");
var bcrypt = require("bcrypt");

var PasswordToken = require("../models/PasswordToken");

const mail = require('../config/mail');




class UserController {
    async teste(req, res) {
        console.log(req.body)
        res.render('teste');
    }
    async inscricao(req, res) {
        res.render('inscricao');
    }
    async index(req, res) {
        var users = await User.getAll();
        res.render('user/home', { users: users });
    }

    async create(req, res) {

        res.render('user/create', { user: undefined })
    }

    async save(req, res) {

        var user = req.body;
        delete user.senha2


        await User.create(user);
        res.redirect('/user')
    }

    async edit(req, res) {
        var user = await User.findById(req.params.id);

        res.render('user/create', { user })
    }
    async update(req, res) {
        var user = req.body


        await User.update(user);

        res.redirect('/user')
    }
    async delete(req, res) {
        var id = req.body.id

        await User.delete(id);

        res.redirect('/user')
    }
    async login(req, res) {

        res.render('user/login');

    }
    async authenticate(req, res) {

        var { email, senha } = req.body;

        var user = await User.findByEmail(email);

        if (user != undefined) {

            var resultado = await bcrypt.compare(senha, user.senha);

            if (resultado) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/");
            } else {
                res.redirect("user/login");
            }

        } else {
            res.redirect("user/login");
        }
    }
    async recoverPassword(req, res) {


        res.render('user/recoverPassword');

    }
    async recoverPasswordDo(req, res) {
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if (result.status) {
            await mail.sendMail({
                from: "suporte.secti.ma@gmail.com",
                to: email,
                text: "teste texto",
                subject: "Recuperar Senha",
                html: "Foi solicitado a recuperação de senha para este email.<br><strong><a href='http://localhost:3001/user/changePassword/"+result.token+"'> clique aqui para recuperar a senha <a/></strong>"
            }).catch(err => {
                console.log(err);

            })
            res.send("Tudo OK!")
        } else {
            res.status(406)
            res.send(result.err);
        }
    }
    async changePassword(req, res) {
        var token = req.params.token;


        res.render('user/changePassword', { token });

    }

    async changePasswordDo(req, res) {
        var token = req.body.token;
        var senha = req.body.senha;
        var isTokenValid = await PasswordToken.validate(token);
        if (isTokenValid.status) {
            await User.changePassword(senha, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        } else {
            res.status(406);
            res.send("Token inválido!");
        }
    }



}

module.exports = new UserController();