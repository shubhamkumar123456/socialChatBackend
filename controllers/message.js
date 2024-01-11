const Message = require('../models/Message')
let User = require('../models/User')

const createMessage = async (req, res) => {
    const message = await Message.create(req.body)
    try {
        if (message) {
            res.status(200).json(message)
        }
    } catch (e) {
        res.status(500).json(e)
    }
}


const getMessage = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId:req.params.conversationId
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
}
const getUserAllMessage = async (req, res) => {
 
    try {
        const user = await User.findOne({_id:req.body.userId}).populate({path:"conversation"});
        // const messages =await Promise.all(
        //     user.conversation.map((msg)=>{
        //         return Message.find({sender:user._id})
        //     })
        //     )
        let conversations = user.conversation
      let arr =[];
        let friendsIds = conversations.map((user)=>{
            // console.log(user.members)
            // {"breed" : { $in : ["Pitbull", "Great Dane", "Pug"]}}
           return  user.members.map((member)=>{
                    if(member!==req.body.userId){
                        arr.push(member)
                    }
                    return arr;
           })
        })
    
        const friendPosts = await Promise.all(
            arr.map((friendId) => {
                return User.find({ _id: friendId })
            })
        );
        res.status(200).json(friendPosts);
    } catch (error) {
        res.status(500).json(error)
    }
}




module.exports = {
    createMessage,
    getMessage,
    getUserAllMessage
}