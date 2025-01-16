const Demanda = require("../models/Demanda");
const fs = require("fs");
const statusLabels = require("../combo-box-data/status");

class DemandaController {
  async index(req, res) {
    var id = req.session.user.id;
    var demandas = await Demanda.findByUser(id);

    res.render("home", {
      demandas: demandas,
      statusLabels: statusLabels,
      messages: {
        success: req.flash("success"), // As mensagens de sucesso são passadas como arrays
        error: req.flash("error"), // O mesmo para as mensagens de erro
      },
    });
  }

  async create(req, res) {
    var demanda = { file: undefined, id: undefined };

    res.render("demanda/create", { demanda, messages: req.flash() });
  }

  async save(req, res) {
    var demanda = req.body;
    demanda.file = req.file ? req.file.path : undefined;
    demanda.iduser = req.session.user.id;

    try {
      await Demanda.create(demanda);
      req.flash("success", "Demanda criada com sucesso!");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "Erro ao criar demanda!");
      res.redirect("/create");
    }
  }

  async edit(req, res) {
    var demanda = await Demanda.findById(req.params.id);

    res.render("demanda/create", { demanda });
  }
  async update(req, res) {
    var demanda = req.body;
    if (req.file) {
      demanda.file = req.file.path;
    }

    await Demanda.update(demanda);

    res.redirect("/");
  }
  async delete(req, res) {
    var id = req.body.id;
    var demanda = await Demanda.findById(id);
    if (demanda.file) {
      fs.unlink(demanda.file, (error) => {
        if (!error) {
          console.log(false);
        } else {
          console.log("Erro ao deletar arquivo.");
        }
      });
    }

    await Demanda.delete(id);

    res.redirect("/");
  }

  async deleteUpload(req, res) {
    var id = req.params.id;
    var demanda = await Demanda.findById(id);
    if (demanda.file) {
      await fs.unlink(demanda.file, async (error) => {
        if (!error) {
          demanda.file = null;
          console.log(demanda);
          await Demanda.update(demanda);
          res.redirect("/edit/" + demanda.id);
        } else {
          return error;
        }
      });
    }
  }

  // Exibir a demanda
  async viewDemanda(req, res) {
    const id = req.params.id;
    const demanda = await Demanda.findById(id);

    if (!demanda) {
      return res.status(404).send("Demanda não encontrada");
    }

    res.render("demanda/list", { demanda, statusLabels: statusLabels });
  }

  // Ingressar na demanda
  async ingressarDemanda(req, res) {
    const id = req.params.id;
    const usuarioId = req.session.user.id;

    const demanda = await Demanda.findById(id);
    if (!demanda) {
      return res.status(404).send("Demanda não encontrada");
    }

    // Atualizar o status para "Em Andamento"
    await Demanda.updateStatus(id, 2, usuarioId); // 2 = Em Andamento
    res.redirect(`/demandas/${id}`);
  }

  // Finalizar a demanda
  async finalizarDemanda(req, res) {
    const id = req.params.id;

    const demanda = await Demanda.findById(id);
    if (!demanda) {
      return res.status(404).send("Demanda não encontrada");
    }

    // Atualizar o status para "Concluído"
    await Demanda.updateStatus(id, 3); // 3 = Concluído
    res.redirect(`/demandas/${id}`);
  }
  async visualizarDemandas(req, res) {
    const idUser = req.session.user.id;
    const demandas = await Demanda.findByUser(idUser);
    res.render("demanda/view-only", {
      demandas,
      statusLabels: statusLabels,
      messages: {
        success: req.flash("success"), // As mensagens de sucesso são passadas como arrays
        error: req.flash("error"), // O mesmo para as mensagens de erro
      },
    });
  }
}

module.exports = new DemandaController();
