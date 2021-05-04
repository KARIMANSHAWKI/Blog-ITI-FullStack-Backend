const express = require("express");
const router = express.Router();
const {create, list, listAllCategoriesTAgs, read, remove, update} = require('../controllers/blog.controller')
const { adminMiddleWare , requireSignin} = require("../controllers/auth.controller");


router.post('/blog', requireSignin, adminMiddleWare, create)
router.get('/blogs', list)
router.get('/blogs-categories-tags', listAllCategoriesTAgs)
router.get('/blog/:slug', read)
router.delete('/blog/:slug',requireSignin,adminMiddleWare, remove)
router.put('/blog/:slug',requireSignin,adminMiddleWare, update)






module.exports = router