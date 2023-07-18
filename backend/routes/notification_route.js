const express = require('express')
const router = express.Router()
const {GetNotifications} = require('../controllers/notification_controller')

const {protect} = require('../middleware/index')

router.route("/get-notifications/:userid").get(protect,GetNotifications)



module.exports = router;