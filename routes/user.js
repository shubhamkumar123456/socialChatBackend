const express = require('express');
const router = express.Router();
const { createuser, updateUser, deleteUser, getUser, getAllUser, loginUser, userfollow, userUnfollow, searchUsers, timeLinePosts, loggedInUser, logoutUser } = require('../controllers/User');
const Auth = require('../middleware/Auth');

router.post('/create', createuser);
router.post('/login', loginUser);
router.get('/loggedInUser',Auth, loggedInUser);
router.post('/logout',Auth, logoutUser);


router.put('/update',Auth, updateUser);
router.delete('/delete',Auth, deleteUser);
router.post('/getone', getUser);
router.get('/', getAllUser);
router.post('/follow/:friendId',Auth, userfollow);
router.get('/searchUsers',Auth, searchUsers);
router.post('/timeLinePosts', timeLinePosts);

module.exports = router;