const express = require('express')
const router = express.Router()
const {CreateMessage,GetMessages} = require('../controllers/message_controller')

const {protect} = require('../middleware/index')

router.route("/create-message").post(protect,CreateMessage)

router.route('/get-messages/:roomId').get(protect,GetMessages)

module.exports = router;