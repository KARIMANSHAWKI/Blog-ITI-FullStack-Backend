const express = require("express");
const router = express.Router();
const {create, list, listAllCategoriesTAgs, read, remove, update, photo, listRelated} = require('../controllers/blog.controller')
const { adminMiddleWare , requireSignin} = require("../controllers/auth.controller");


router.post('/blog', requireSignin, adminMiddleWare, create)
router.get('/blogs', list)
router.post('/blogs-categories-tags', listAllCategoriesTAgs)
router.get('/blog/:slug', read)
router.delete('/blog/:slug',requireSignin,adminMiddleWare, remove)
router.put('/blog/:slug',requireSignin,adminMiddleWare, update)
router.get('/blog/photo/:slug',photo)
router.post('/blogs/related', listRelated)







module.exports = router