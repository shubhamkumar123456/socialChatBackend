const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getAll,
  getSingleUser,
  updateCoverPic,
  updateProfilePic,
  addComment,
  updateLike,
} = require("../controllers/post");
const upload = require("../middleware/multer");
const Auth = require("../middleware/Auth");

router.post("/create", Auth, upload.array("files"), createPost);
(router.put("/update/:id", updatePost), router.delete("/delete", deletePost));
router.get("/allPost", Auth, getAll);
router.get("/getsinglePost/:id", getSingleUser);
router.put("/updateCoverPic", updateCoverPic);
router.put("/updateProfilePic", updateProfilePic);
router.post("/comment/:postId", Auth, addComment);
router.post("/like/:postId", Auth, updateLike);

module.exports = router;
