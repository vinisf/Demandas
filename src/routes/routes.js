const express = require('express');
const router = express.Router();
const DemandaController = require('../controllers/DemandaController')
const UserController = require('../controllers/UserController')
const auth = require('../middlewares/auth')

var multer = require('multer')
var storage = require('../config/multer')

const upload = multer({ storage })

//Rotas demanda responsavel
router.get('/demandas/:id', auth,DemandaController.viewDemanda);
router.post('/demandas/:id/ingressar', DemandaController.ingressarDemanda);
router.post('/demandas/:id/finalizar', DemandaController.finalizarDemanda);


//Rotas demanda admin
router.get('/dev',auth, DemandaController.visualizarDemandas)

router.get('/',auth, DemandaController.index)
router.get('/create',auth, DemandaController.create)
router.post('/save',auth, upload.single('file'), DemandaController.save)
router.get('/edit/:id', auth,  DemandaController.edit)
router.post('/update/:id',auth, upload.single('file'), DemandaController.update)
router.post('/delete', DemandaController.delete)
router.get('/deleteUpload/:id',auth,  DemandaController.deleteUpload)

//Rotas user
router.get('/user', auth, UserController.index)
router.get('/user/create', UserController.create)
router.post('/user/save', upload.single('file'), UserController.save)
router.get('/user/edit/:id',auth,  UserController.edit)
router.post('/user/update/:id',auth, upload.single('file'), UserController.update)
router.post('/user/delete',auth, UserController.delete)
router.get("/user/login", UserController.login )
router.get("/user/recoverPassword", UserController.recoverPassword )
router.post("/user/recoverPasswordDo", UserController.recoverPasswordDo )
router.get("/user/changePassword/:token", UserController.changePassword )
router.post("/user/changePasswordDo", UserController.changePasswordDo )



router.post("/authenticate", UserController.authenticate)

router.get("/logout", (req, res)=>{
    req.session.user = undefined
    res.clearCookie('connect.sid'); // Limpa o cookie de sessão
    res.redirect('user/login')
} )


module.exports = router;
