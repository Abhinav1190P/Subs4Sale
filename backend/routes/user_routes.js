const express = require('express')
const router = express.Router()
const {register,login,protectedRoute,GetAllUsers, 
    IsAuth
    ,CreateChatRelation,GetChatRelations,GetUserInfo,UpdateUserInfo,GetUserProfile, UpdateProfilePhoto, GetUserById} = require('../controllers/user_controller')
const {protect} = require('../middleware/index')

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/protected-route").get(protect,protectedRoute)

router.route('/create-chat-rel').post(protect,CreateChatRelation)

router.route('/get-chat-rel').get(protect,GetChatRelations)

router.route('/GetUserInfo').get(protect,GetUserInfo)

router.route('/UpdateUser').post(protect,UpdateUserInfo)

router.route('/isAuth').get(protect,IsAuth)

router.route('/get-user-profile').get(protect,GetUserProfile)

router.route('/update-profile').post(protect,UpdateProfilePhoto)

router.route("/get-user-info/:userid").get(protect,GetUserById)

module.exports = router;