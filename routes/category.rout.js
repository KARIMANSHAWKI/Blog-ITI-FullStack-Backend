const express = require("express");
const { adminMiddleWare , requireSignin} = require("../controllers/auth.controller");
const { create, list, read, remove } = require("../controllers/category.controller");
const router = express.Router();
// const {} = require('../controllers/auth.controller')

// ***************** Validators ***************
const { categoryCreateValidator } = require("../validators/category.validator");
const { runValidation } = require("../validators/index.validator");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleWare,
  create
);

router.get('/categories', list);
router.get('/category/:slug', read)
router.delete('/category/:slug',requireSignin, adminMiddleWare, remove )


module.exports = router