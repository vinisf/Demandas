const knex = require("../config/database");
const fs = require('fs');
var path = require('path')


class Demanda {
  async getAll() {
    try {
      var result = await knex.select("*").table("demandas");
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async create(demanda) {
    try {
      // Insere a demanda e retorna o resultado
      const result = await knex("demandas").insert(demanda).returning("id");
      console.log("Demanda criada com sucesso!");

      // Retorna o ID da demanda criada
      return result[0]; // O resultado é um array, então pegamos o primeiro item
    } catch (err) {
      console.log("Erro ao criar demanda:", err);
      throw err; // Lança o erro para ser tratado no controller
    }
  }

  async findById(id) {
    try {
      var result = await knex.select("*").where({ id: id }).table("demandas");
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }

  async findByUser(id) {
    try {
      var result = await knex
        .select("*")
        .where({ iduser: id })
        .table("demandas");
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async update(demanda) {
    var editDemanda = await this.findById(demanda.id);
    if (editDemanda != undefined) {
      try {
        await knex.update(demanda).where({ id: demanda.id }).table("demandas");
        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "A demanda não existe!" };
    }
  }

  async updateStatus(id, status, usuarioId) {
    var editDemanda = await this.findById(id);
    if (editDemanda != undefined) {
      try {
        await knex
          .update({ status: status, responsavel: usuarioId })
          .where({ id: id })
          .table("demandas");
        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "A demanda não existe!" };
    }
  }

  async delete(id) {
    var editDemanda = await this.findById(id);
    if (editDemanda != undefined) {
      try {
        await knex.delete().where({ id: id }).table("demandas");

        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "A demanda não existe!" };
    }
  }

  async getFilesByDemandaId(demandaId) {
    try {
      // Busca os arquivos associados a uma demanda
      var result = await knex("uploads").where({ demanda_id: demandaId });
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async deleteFileById(fileId) {
    try {
      // Busca o arquivo pelo ID
      const file = await knex("uploads").where({ id: fileId }).first();
      if (!file) {
        throw new Error("Arquivo não encontrado");
      }

      // Deleta o arquivo fisicamente do sistema
      await fs.promises.unlink(path.join(__dirname, "..", file.path));

      // Deleta o arquivo da tabela 'uploads'
      await knex("uploads").where({ id: fileId }).del();

      return file;
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao deletar o arquivo");
    }
  }

  async updateDemandaFile(demandaId) {
    try {
      // Encontra a demanda
      const demanda = await this.findById(demandaId);
      if (demanda) {
        // Atualiza a demanda, removendo o campo 'file'
        demanda.file = null;
        await knex("demandas").update(demanda).where({ id: demandaId });
        return demanda;
      } else {
        throw new Error("Demanda não encontrada");
      }
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao atualizar a demanda");
    }
  }
}

module.exports = new Demanda();
