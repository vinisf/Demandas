const knex = require('../config/database');
var bcrypt = require("bcrypt");


class User {
    async getAll() {
        try {

            var result = await knex.select("*").table("users");
            return result;
        } catch (error) {
            console.log(error)
            return [];

        }
    }

    async create(user) {
        try {
            user.senha = await bcrypt.hash(user.senha, 10);
            await knex.insert(user).table("users");
        } catch (err) {
            console.log(err);
        }
    }

    async findById(id) {
        try {

            var result = await knex.select("*").where({ id: id }).table("users");
            return result[0];
        } catch (err) {
            console.log(err);
        }
    }
    async update(user) {

        var edituser = await this.findById(user.id);
        if (edituser != undefined) {
            try {
                await knex.update(user).where({ id: user.id }).table("users");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {

            return { status: false, err: "A user não existe!" }
        }
    }

    async delete(id) {
       
        var edituser = await this.findById(id);
        if (edituser != undefined) {
            try {
                await knex.delete().where({id: id}).table("users");

                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {

            return { status: false, err: "A user não existe!" }
        }
    }

    async findByEmail(email){
        try{
            var result = await knex.select(["id","email","senha","role"]).where({email:email}).table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }

        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async changePassword(newPassword,id,token){
        var PasswordToken = require("./PasswordToken");

        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({senha: hash}).where({id: id}).table("users");
        await PasswordToken.setUsed(token);
    }
    



}



module.exports = new User();