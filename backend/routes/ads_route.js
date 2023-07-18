const express = require('express')
const router = express.Router()
const {CreateAd,GetAllAds,GetFilteredAds,GetSearchRecommendations,GetAdInfo} = require('../controllers/ads_controller')
const {protect} = require('../middleware/index')

router.route("/create-ad").post(protect,CreateAd)

router.route("/get-all-ads").get(GetAllAds)

router.route("/get-filtered-ads/:searchQuery").get(protect,GetFilteredAds)

router.route("/get-search-recommendations/:searchQuery").get(protect,GetSearchRecommendations)

router.route("/get-ad-info/:id").get(protect,GetAdInfo)



module.exports = router;