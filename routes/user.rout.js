const express = require('express');
const router = express.Router();
const {requireSignin, authMiddleWare, adminMiddleWare} = require('../controllers/auth.controller')
const {read, publicProfile, update, photo } = require('../controllers/user.controller')


router.get('/user/profile', requireSignin, authMiddleWare, read);
router.get('/user/:username', publicProfile)

router.put('/user/update',requireSignin, authMiddleWare, update)
router.get('/user/photo/:username', photo)



module.exports = router;