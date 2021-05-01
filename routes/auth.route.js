const express = require('express');
const router = express.Router();
const {signup, signin, signout, requireSignin} = require('../controllers/auth.controller')
const expressValidator = require('express-validator').check;
const { check } = require('express-validator');

// ***************** Validators ***************
const {userSignUpValidator,userSignInValidator} = require('../validators/auth.validator')
const {runValidation} = require('../validators/index.validator')

router.post('/signup',userSignUpValidator,runValidation,signup);
router.post('/signin',userSignInValidator,runValidation,signin);
router.get('/signout',signout);

router.get('/secret', requireSignin, (req, res)=>{
    res.json({
        message : req.user    })
})















module.exports = router;