const express = require('express');
const router = express.Router();
const DemandaController = require('../controllers/DemandaController')
const UserController = require('../controllers/UserController')
const InscricaoController = require('../controllers/InscricaoController')
const auth = require('../middlewares/auth')

var multer = require('multer')
var storage = require('../config/multer')

const upload = multer({ storage })

//Rotas inscricao
router.get("/inscricao", InscricaoController.create)
router.post('/inscricao/save', InscricaoController.save)


//Rotas demanda
router.get('/',auth, DemandaController.index)
router.get('/create',auth, DemandaController.create)
router.post('/save', upload.single('file'), DemandaController.save)
router.get('/edit/:id', DemandaController.edit)
router.post('/update/:id', upload.single('file'), DemandaController.update)
router.post('/delete', DemandaController.delete)
router.get('/deleteUpload/:id', DemandaController.deleteUpload)

//Rotas user
router.get('/user', UserController.index)
router.get('/user/create', UserController.create)
router.post('/user/save', upload.single('file'), UserController.save)
router.get('/user/edit/:id', UserController.edit)
router.post('/user/update/:id', upload.single('file'), UserController.update)
router.post('/user/delete', UserController.delete)
router.get("/user/login", UserController.login )
router.get("/user/recoverPassword", UserController.recoverPassword )
router.post("/user/recoverPasswordDo", UserController.recoverPasswordDo )
router.get("/user/changePassword/:token", UserController.changePassword )
router.post("/user/changePasswordDo", UserController.changePasswordDo )



router.post("/authenticate", UserController.authenticate)

router.get("/logout", (req, res)=>{
    req.session.user = undefined
    res.redirect('user/login')
} )


module.exports = router;
