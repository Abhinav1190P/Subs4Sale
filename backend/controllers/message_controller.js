const {Message} = require('../models/Message')

exports.CreateMessage = async (req,res,next) => {
    const {sender,message,file,reciever,roomcode} = req.body
    try {
        const newMessage = await Message({
            sender,
            message,
            file,
            reciever,
            roomcode
        }) 
        const savedMessage = await newMessage.save()
        if(savedMessage){
            return res.status(200).send('Message created')
        }
        else{
            return res.status(400).send("Couldn't message")
        }
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

exports.GetMessages = async (req,res,next) => {
    const { roomId } = req.params;

    try {
        const theMessages = await Message.find({roomcode:roomId})
        if(theMessages.length > 0) {
            return res.status(200).send(theMessages)
        }
        else{
            return res.status(400).send("You've got no messages")
        }
    } catch (error) {
        return res.status(400).send(error.message)
    }
}