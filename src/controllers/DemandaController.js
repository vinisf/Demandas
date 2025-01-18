const Demanda = require("../models/Demanda");
const Upload = require("../models/Upload"); // Importando o model de Upload

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

    res.render("demanda/create", {
      demanda,
      messages: {
        success: req.flash("success"), // As mensagens de sucesso são passadas como arrays
        error: req.flash("error"), // O mesmo para as mensagens de erro
      },
    });
  }

  async save(req, res) {
    var demanda = req.body;
    demanda.iduser = req.session.user.id;

    try {
      // Cria a demanda no banco
      const inserted = await Demanda.create(demanda);
      const demandaId = inserted.id; // Obtém o ID da demanda criada

      // Se houver arquivos, salva na tabela 'uploads' usando o model de Upload
      if (req.files && req.files.length > 0) {
        const filesData = req.files.map((file) => ({
          demanda_id: demandaId, // Relaciona os arquivos com a demanda
          path: file.path,
          name: file.originalname,
        }));

        await Upload.create(filesData); // Chama o método do model 'Upload' para salvar os arquivos
      }

      req.flash("success", "Demanda criada com sucesso!");
      res.redirect("/");
    } catch (error) {
      console.error("❌ Erro ao criar demanda:", error);
      req.flash("error", "Erro ao criar demanda!");
      res.redirect("/create");
    }
  }

  async update(req, res) {
    var demanda = req.body;
    const demandaId = req.params.id;

    try {
      // Atualiza a demanda
      await Demanda.update(demanda);

      // Se houver novos arquivos, adiciona na tabela de uploads
      if (req.files && req.files.length > 0) {
        const filesData = req.files.map((file) => ({
          demanda_id: demandaId, // Relaciona os arquivos com a demanda
          path: file.path,
          name: file.originalname,
        }));

        await Upload.create(filesData); // Chama o model de Upload para salvar os arquivos
      }

      req.flash("success", "Demanda atualizada com sucesso!");
      res.redirect("/");
    } catch (error) {
      console.error("❌ Erro ao atualizar demanda:", error);
      req.flash("error", "Erro ao atualizar demanda!");
      res.redirect("/edit/" + demandaId);
    }
  }

  async edit(req, res) {
    try {
      // Encontra a demanda
      var demanda = await Demanda.findById(req.params.id);

      // Encontra os arquivos associados à demanda usando o modelo
      var files = await Demanda.getFilesByDemandaId(req.params.id);

      // Passa a demanda e os arquivos para a view
      res.render("demanda/create", {
        demanda,
        files, // Passa os arquivos para a view
        messages: {
          success: req.flash("success"),
          error: req.flash("error"),
        },
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Erro ao carregar a demanda!");
      res.redirect("/"); // Redireciona caso haja erro
    }
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
    req.flash("success", "Demanda Deletada com sucesso!");
    res.redirect("/");
  }

  async deleteUpload(req, res) {
    try {
      const fileId = req.params.id; // ID do arquivo a ser deletado

      // Deleta o arquivo e obtém o arquivo deletado
      const deletedFile = await Demanda.deleteFileById(fileId);

      // Atualiza a demanda, caso necessário
      await Demanda.updateDemandaFile(deletedFile.demanda_id);

      // Mensagem de sucesso e redireciona para a edição da demanda
      req.flash("success", "Upload deletado com sucesso!");
      res.redirect("/edit/" + deletedFile.demanda_id);
    } catch (error) {
      console.log(error);
      req.flash("error", "Erro ao excluir o arquivo.");
      res.redirect("/"); // Redireciona caso haja erro
    }
  }
  
  async viewDemanda(req, res) {
    const id = req.params.id;

    try {
      // Buscar a demanda
      const demanda = await Demanda.findById(id);

      if (!demanda) {
        return res.status(404).send("Demanda não encontrada");
      }

      // Buscar os arquivos associados à demanda usando o modelo Upload
      const files = await Upload.findByDemandaId(id);

      // Passar a demanda e os arquivos para a view
      res.render("demanda/view-only", {
        demanda,
        files, // Passa os arquivos associados à demanda
        statusLabels: statusLabels,
        messages: {
          success: req.flash("success"), // As mensagens de sucesso são passadas como arrays
          error: req.flash("error"), // O mesmo para as mensagens de erro
        },
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "Erro ao carregar a demanda.");
      res.redirect("/"); // Redireciona caso haja erro
    }
  }

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

  async finalizarDemanda(req, res) {
    const id = req.params.id;

    const demanda = await Demanda.findById(id);
    if (!demanda) {
      return res.status(404).send("Demanda não encontrada");
    }

    // Atualizar o status para "Concluído"
    await Demanda.updateStatus(id, 3); // 3 = Concluído
    req.flash("success", "Demanda finalizada com sucesso!");
    res.redirect(`/demandas/${id}`);
  }

  async visualizarDemandas(req, res) {
    const idUser = req.session.user.id;
    const demandas = await Demanda.findByUser(idUser);
    res.render("demanda/list", {
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
