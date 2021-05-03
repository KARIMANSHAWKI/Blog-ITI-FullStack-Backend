const express = require("express");
const router = express.Router();
const {create} = require('../controllers/blog.controller')
const { adminMiddleWare , requireSignin} = require("../controllers/auth.controller");


router.post('/blog', requireSignin, adminMiddleWare, create)

module.exports = router