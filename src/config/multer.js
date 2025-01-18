var multer = require('multer')
var path = require('path')

const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = "upload/"+ req.session.user.id;
        //Verifica se não existe
        if (!fs.existsSync(dir)) {
            //Efetua a criação do diretório
            fs.mkdir(dir, (err) => {
                if (err) {
                    console.log("Deu ruim...");
                    return
                }
           

                console.log("Diretório criado! =)")
            });
        }
        cb(null, dir)

        
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + Date.now() + path.extname(file.originalname))
    }
})

module.exports = storage

