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
  listSearch,
  listByUser
} = require("../controllers/blog.controller");
const {
  adminMiddleWare,
  requireSignin,
  authMiddleware,
  canUpdateDeleteBlog
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
router.post("/user/blog", requireSignin, authMiddleware, create);
router.get("/:username/blogs", listByUser);

router.delete("/user/blog/:slug", requireSignin, authMiddleware,canUpdateDeleteBlog, remove);
router.put("/user/blog/:slug", requireSignin, authMiddleware,canUpdateDeleteBlog, update);




module.exports = router;
