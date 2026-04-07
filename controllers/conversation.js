const Conversation = require('../models/Conversation');
const Message = require('../models/Message')
const User = require('../models/User');

const createConversation = async(req,res)=>{
    let senderId = req.userId;
    
    let conversation  = await Conversation.find({
        members:{$all:[req.params.recieverId,senderId]}
    })
    
    console.log("conversation", conversation)
    
    if(conversation.length){
        //    console.log("conversation",conversation)
        res.status(200).json(conversation[0])
    }else{
        conversation =await Conversation.create({
            members: [senderId,recieverId]
        })
    
        try {
            let user = await User.findOne({_id:senderId});
            let friend = await User.findOne({_id:recieverId})
            await Message.create({})
       
 
    
} catch (error) {
    res.status(500).json(error)
}
   }
    
  

   
}

const getConversation = async(req,res)=>{
   try {
        const conversation  = await Conversation.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(conversation)
   } catch (error) {
    res.status(500).json(error)
   }
}




module.exports = {
    createConversation,
    getConversation
}