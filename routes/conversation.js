const express = require('express');
const { createConversation, getConversation } = require('../controllers/Conversation');
const router = express.Router();


router.post('/create',createConversation)
router.get('/:userId',getConversation)




module.exports = router