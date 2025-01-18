const knex = require('../config/database'); // Importa o knex

class Upload {
  // Método para criar registros de upload na tabela 'uploads'
  async create(filesData) {
    try {
      // Insere os dados de arquivos na tabela 'uploads'
      await knex("uploads").insert(filesData);
      console.log("Arquivos salvos com sucesso!");
    } catch (error) {
      console.log("Erro ao salvar arquivos:", error);
      throw error;
    }
  }

  // Método para encontrar arquivos associados a uma demanda
  async findByDemandaId(demandaId) {
    try {
      const result = await knex("uploads").where({ demanda_id: demandaId });
      return result;
    } catch (error) {
      console.log("Erro ao buscar arquivos:", error);
      return [];
    }
  }

  // Método para excluir um arquivo
  async delete(id) {
    try {
      await knex("uploads").where({ id: id }).delete();
    } catch (error) {
      console.log("Erro ao excluir arquivo:", error);
    }
  }
}

module.exports = new Upload();
