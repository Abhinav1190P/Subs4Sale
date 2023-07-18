const {Favourite} = require('../models/Favourite')
const {Notification} = require('../models/Notifications')
exports.CreateFavourite = async (req,res,next) => {
    const {ad_id, picture, price, title, ad_provider} = req.body
    const user_id = req.user._id

    try {
      const newFavourite = await new Favourite({
        ad_id,
        picture,
        user_id,
        price,
        title,
        ad_provider
      })
      const savedFavourite = await newFavourite.save()
      if(savedFavourite){
        createNotification(user_id, 'like-ad');
        return res.status(200).send("Added to favourites")
      }
      else{
        return res.status(400).send("Something went wrong")
      }
    } catch (error) {
      return res.status(400).send(error.message)
    }
  }




  exports.deleteFavorite = async (req, res, next) => {
    const {favoriteId} = req.params;
    
    try {
      const deletedFavorite = await Favourite.findOneAndDelete({ad_id:favoriteId});
      
      if (deletedFavorite) {
        createNotification(req.user._id, 'unlike-ad');
        return res.status(200).send('Favorite deleted successfully');
      } else {
        return res.status(404).send('Favorite not found');
      }
    } catch (error) {
      return res.status(500).send('Something went wrong');
    }
  };

  exports.GetAllFavourites = async (req,res,next) => {
    const {userid} = req.params
   
    try {
      const myfavs = await Favourite.find({user_id:userid})
      if(myfavs.length > 0) {
        return res.status(200).send(myfavs)
      }
      else {
        return res.status(200).send([])
      }
    } catch (error) {
      return res.status(400).send(error.message)
    }
  }
  

  const createNotification = async (userId, type) => {
    try {
      let message = '';
  
      switch (type) {
        case 'sign-up':
          message = 'New user signed up';
          break;
        case 'sign-in':
          message = 'User signed in';
          break;
        case 'profile-update':
          message = 'Profile updated';
        case 'like-ad':
          message = 'You liked an Ad'
          break;
        case 'unlike-ad':
          message = 'You unliked an Ad'
        default:
          break;
      }
  
      const newNotification = new Notification({
        type: type,
        userId: userId,
        message: message,
        createdAt: new Date(),
      });
  
      await newNotification.save();
    } catch (error) {
      
    }
  };