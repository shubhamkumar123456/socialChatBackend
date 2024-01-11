const express = require('express');
const { createMessage, getMessage, getUserAllMessage } = require('../controllers/message');
const router = express.Router();

router.post('/create', createMessage)
router.get('/:conversationId', getMessage)
router.post('/allMessage', getUserAllMessage)



module.exports = router