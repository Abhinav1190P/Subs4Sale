const { Ads } = require("../models/Ads")
const { Favourite } = require("../models/Favourite")
const { User } = require('../models/User')

exports.CreateAd = async (req, res, next) => {

  const { title, description, price_range, original_price, pictures, maincategory, subcategory, tags } = req.body
  const provider = req.user._id
  try {
    const newAd = new Ads({
      title,
      description,
      provider,
      provider,
      price_range,
      original_price,
      pictures,
      maincategory,
      subcategory,
      tags
    })
    const savedAd = await newAd.save()

    if (savedAd) {
      return res.status(200).send("Created Ad")
    }
    return res.status(400).send("Something went wrong")
  } catch (error) {
    return res.status(400).send(error.message)
  }

}

exports.GetAllAds = async (req, res, next) => {
  try {
    const allAds = await Ads.find({});

    const adsWithUsername = await Promise.all(
      allAds.map(async (ad) => {
        const provider = await User.findById(ad.provider);
        const username = provider ? provider.username : null;
        const location = provider ? provider.location : null
        return { ...ad.toObject(), username, location };
      })
    );

    return res.status(200).send(adsWithUsername);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.GetFilteredAds = async (req, res, next) => {
  const { searchQuery } = req.params

  try {
    const searchResults = await Ads.find({ $text: { $search: searchQuery } });

    if (searchResults.length > 0) {
      return res.status(200).send(searchResults)
    } else {
      return res.status(200).send([])
    }

  } catch (error) {
    return res.status(400).send(error.message)
  }
}

exports.GetSearchRecommendations = async (req, res, next) => {
  const { searchQuery } = req.params;

  try {
    const allAds = await Ads.find({});
    const allUsers = await User.find({}).select('-password -email -emailVerificationToken -emailVerificationTokenExpiry -location -phone');

    const filteredAds = allAds.filter((item) => {
      return item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const filteredUsers = allUsers.filter((user) => {
      
      return user.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const response = {
      ads: filteredAds,
      users: filteredUsers,
      userId: req.user._id,
    };

    res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.GetAdInfo = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const adInfo = await Ads.findById(id);

    if (adInfo) {
      const favorite = await Favourite.findOne({ ad_id: id, user_id: userId });

      const isLiked = !!favorite;


      const user = await User.findById(adInfo.provider).select('username profile_photo');


      const adData = {
        ...adInfo.toObject(),
        isLiked,
        user: {
          username: user.username,
          profilePicture: user.profile_photo,
        },
      };

      return res.status(200).send(adData);
    } else {
      return res.status(404).send('Ad not found');
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

