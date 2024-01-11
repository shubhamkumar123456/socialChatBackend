const express = require('express');
const router =express.Router();
const { createPost, updatePost, deletePost, getAll, getSingleUser, updateCoverPic, updateProfilePic } = require('../controllers/post');

router.post ('/create',createPost);
router.put('/update/:id',updatePost),
router.delete('/delete',deletePost);
router.get('/allPost',getAll);
router.get('/getsinglePost/:id',getSingleUser);
router.put('/updateCoverPic',updateCoverPic);
router.put('/updateProfilePic',updateProfilePic);


module.exports = router;