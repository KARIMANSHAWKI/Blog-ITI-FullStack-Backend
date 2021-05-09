const express = require('express');
const router = express.Router();
const {requireSignin, authMiddleWare, adminMiddleWare} = require('../controllers/auth.controller')
const {read, publicProfile} = require('../controllers/user.controller')


router.get('/profile', requireSignin, adminMiddleWare, read);
router.get('/user/:username', publicProfile)



module.exports = router;