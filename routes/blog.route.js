const express = require("express");
const router = express.Router();
const {
  create,
  list,
  listAllCategoriesTAgs,
  read,
  remove,
  update,
  photo,
  listRelated,
  listSearch
} = require("../controllers/blog.controller");
const {
  adminMiddleWare,
  requireSignin,
  authMiddleWare
} = require("../controllers/auth.controller");

router.post("/blog", requireSignin, adminMiddleWare, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllCategoriesTAgs);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignin, adminMiddleWare, remove);
router.put("/blog/:slug", requireSignin, adminMiddleWare, update);
router.get("/blog/photo/:slug", photo);
router.post("/blogs/related", listRelated);
router.get("/blog/search", listSearch);


// auth user blog crud
router.post("/user/blog", requireSignin, authMiddleWare, create);
router.delete("/user/blog/:slug", requireSignin, authMiddleWare, remove);
router.put("/user/blog/:slug", requireSignin, authMiddleWare, update);



module.exports = router;
