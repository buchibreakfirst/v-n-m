const express = require('express')

const router = express.Router()


const home_handle = require('../router_handle/home')
router.get('/region',home_handle.regRegion)
router.get('/classify',home_handle.regClassify)
router.get('/cuision',home_handle.regCuision)
router.get('/detail',home_handle.regDetail)



module.exports = router 