const express = require('express');
const router = express.Router();
const {requireSignin, authMiddleWare, adminMiddleWare} = require('../controllers/auth.controller')
const {read} = require('../controllers/user.controller')


router.get('/profile', requireSignin, adminMiddleWare, read);



module.exports = router;