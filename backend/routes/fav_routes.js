const express = require('express')
const router = express.Router()
const {CreateFavourite,deleteFavorite,GetAllFavourites} = require('../controllers/favourite_controller')
const {protect} = require('../middleware/index')

router.route("/create-fav").post(protect,CreateFavourite)
router.route("/delete-fav/:favoriteId").delete(protect,deleteFavorite)
router.route("/get-favs/:userid").get(protect,GetAllFavourites)

module.exports = router;