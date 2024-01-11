const express = require('express');
const router = express.Router();
const { createuser, updateUser, deleteUser, getUser, getAllUser, loginUser, userfollow, userUnfollow, searchUsers, timeLinePosts } = require('../controllers/User');

router.post('/create', createuser);
router.post('/login', loginUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.post('/getone', getUser);
router.get('/', getAllUser);
router.post('/follow/:id', userfollow);
router.post('/unfollow/:id', userUnfollow);
router.post('/searchUsers', searchUsers);
router.post('/timeLinePosts', timeLinePosts);

module.exports = router;