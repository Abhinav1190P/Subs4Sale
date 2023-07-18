const { Notification } = require('../models/Notifications');

exports.GetNotifications = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const filteredNotifications = await Notification.find({
      userId: userid,
      createdAt: { $gt: twoDaysAgo },
    });

    if (filteredNotifications.length > 0) {
      return res.status(200).send(filteredNotifications);
    } else {
      return res.status(200).send('You have no current notifications');
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
