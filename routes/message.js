const express = require('express');
const { sendMessage, getSingleChat, getuserConversations } = require('../controllers/message');
const Auth = require('../middleware/Auth');
const router = express.Router();

router.post('/create/:recieverId',Auth,sendMessage)
router.get('/getChat/:friendId',Auth, getSingleChat)
router.get('/getConversation',Auth, getuserConversations)
// router.get('/:conversationId', getMessage)
// router.post('/allMessage', getUserAllMessage)



module.exports = router