const knex = require('../config/database');

class Demanda {
    async getAll() {
        try {

            var result = await knex.select("*").table("demandas");
            return result;
        } catch (error) {
            console.log(error)
            return [];

        }
    }

    async create(demanda) {
        try {

            await knex.insert(demanda).table("demandas");
        } catch (err) {
            console.log(err);
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

            var result = await knex.select("*").where({ iduser: id }).table("demandas");
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
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {

            return { status: false, err: "A demanda não existe!" }
        }
    }

    async delete(id) {
       
        var editDemanda = await this.findById(id);
        if (editDemanda != undefined) {
            try {
                await knex.delete().where({id: id}).table("demandas");

                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {

            return { status: false, err: "A demanda não existe!" }
        }
    }


}



module.exports = new Demanda();