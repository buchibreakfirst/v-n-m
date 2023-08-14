const express = require('express')
const router = express.Router()


const cuisionUser_handle = require('../router_handle/cuisionUser')

router.post('/cuisionuser/:user_id',cuisionUser_handle.regCuisionUser)
router.post('/addcuisionuser/:user_id/:cuision_id',cuisionUser_handle.regAddCuisionUser)
router.get('/userinfo',cuisionUser_handle.userinfo)
router.post('/remarks',cuisionUser_handle.remarks)
module.exports = router 