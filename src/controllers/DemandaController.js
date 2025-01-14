const Demanda = require("../models/Demanda");
const fs = require('fs');

class DemandaController {
    async index(req, res) {
        var id = req.session.user.id

        var demandas = await Demanda.findByUser(id);

        res.render('home', { demandas: demandas });
    }

    async create(req, res) {
        var demanda = {file: undefined, id: undefined}

        res.render('demanda/create', { demanda })
    }

    async save(req, res) {
        var demanda = req.body;
        demanda.file = req.file ? req.file.path : undefined
        demanda.iduser = req.session.user.id
        await Demanda.create(demanda);
        res.redirect('/')
    }

    async edit(req, res) {
        var demanda = await Demanda.findById(req.params.id);

        res.render('demanda/create', { demanda })
    }
    async update(req, res) {
        var demanda = req.body
        if (req.file) {
            demanda.file = req.file.path
        }

        await Demanda.update(demanda);

        res.redirect('/')
    }
    async delete(req, res) {
        var id = req.body.id
        var demanda = await Demanda.findById(id);
        if (demanda.file) {
            fs.unlink(demanda.file, (error) => {
                if (!error) {
                    console.log(false);
                } else {
                    console.log('Erro ao deletar arquivo.');
                }
            })
        }


        await Demanda.delete(id);

        res.redirect('/')
    }

    async deleteUpload(req, res) {
        var id = req.params.id
        var demanda = await Demanda.findById(id);
        if (demanda.file) {
            await fs.unlink(demanda.file, async (error) => {
                if (!error) {
                    demanda.file = null
                    console.log(demanda)
                   await Demanda.update(demanda);
                    res.redirect('/edit/'+demanda.id)
                } else {
                    return error
                }
            })
        }
        

    }




}

module.exports = new DemandaController();