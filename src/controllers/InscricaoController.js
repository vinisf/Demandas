

const Inscricao = require("../models/Inscricao");

class InscricaoController{


    async create(req, res) {
        res.render('inscricao');
    }
    
    async save(req, res) {
        
        var inscricao = req.body;
        console.log(inscricao);
        
        await Inscricao.create(inscricao);
        res.redirect('/');
    }


}

module.exports = new InscricaoController();