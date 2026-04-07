const express = require('express');
const { createConversation, getConversation } = require('../controllers/conversation');
const Auth = require('../middleware/Auth');
const router = express.Router();


router.post('/create/:recieverId',Auth, createConversation)
router.get('/:userId', getConversation)




module.exports = router