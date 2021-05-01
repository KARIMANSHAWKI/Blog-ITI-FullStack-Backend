const express = require("express");
const router = express.Router();

// **************** Controller *************
const {
  adminMiddleWare,
  requireSignin,
} = require("../controllers/auth.controller");
const { create, list, read, remove } = require("../controllers/tag.controller");

// ***************** Validators ***************
const { tagCreateValidator } = require("../validators/tag.validator");
const { runValidation } = require("../validators/index.validator");

router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleWare,
  create
);

router.get("/tag", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleWare, remove);

module.exports = router;
