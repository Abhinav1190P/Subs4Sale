
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models/User')
const { ChatRelation } = require('../models/ChatRelation')
const { Message } = require('../models/Message')
const { Ads } = require('../models/Ads')
const {Notification} = require('../models/Notifications')

exports.register = async (req, res, next) => {
  const { password, profile_photo, username, email, phone, gender, location } = req.body;

  try {

    const userFound = await User.findOne({ email });

    if (!userFound) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const emailToken = jwt.sign({ username: username }, 'abhinav', { expiresIn: '15min' });
      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
      const finalExpirationTime = expirationTime.toISOString();
      let Token = '';

      const newUser = new User({
        email,
        profile_photo,
        username: username,
        password: hashedPassword,
        phone: phone,
        gender:gender,
        location:location,
        emailVerificationToken: emailToken,
        emailVerificationTokenExpiry: finalExpirationTime
      });

      const savedUser = await newUser.save();
      createNotification(newUser._id, 'sign-up');
      const token = jwt.sign({ email: savedUser.email, id: savedUser._id }, 'abhinav', { expiresIn: '1h' });
      Token = token;

      let testAccount = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pandeysandeep1190@gmail.com',
          pass: 'zpzqdreaqzorwdfe'
        }
      });

      let info = await transporter.sendMail({
        from: '"YoutubeMate 👻" <abhinav@gmail.com>',
        to: 'pandeysandeep1190@gmail.com',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: `<b>Hello! Verify email address by clicking on this <a href=http://localhost:3001/api/verify/verify-email?token=${token}>link</a></b>`,
      });

      transporter.sendMail(info, function (error, data) {
        if (error) {
          console.log(error)
        }
        else {
          console.log("Email sent: " + info.response)
        }
      })
      return res.status(200).send({ success: true, message: 'User registered' });
    } else {
      return { success: false, message: 'User already exists' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while signing up the user.');
  }
}


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    createNotification(user._id, 'sign-in');
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'abhinav', { expiresIn: '5h' });


    res.json({ token });

  } catch (error) {

    next(error);
  }
};


exports.GetUserById = async (req,res,next) => {
  const {userid} = req.params
  try {
    const users = await User.findById(userid).select('-password -emailVerificationToken');

    if (!users) {
      return res.status(200).json({ error: 'User not found' });
    }

    const ads = await Ads.find({ provider: users._id })
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({ users, ads });
  } catch (error) {
    next(error);
  }
}


exports.protectedRoute = async (req, res, next) => {
  try {
    if (req.user) {
      return res.status(200).send({ verified: true })
    }
  } catch (error) {
    console.log("error: ", error);
  }
}



exports.CreateChatRelation = async (req, res, next) => {
  const { reciever_id, roomcode } = req.body;
  try {
    if (req.user) {
      const doesRelationAlreadyExists = await ChatRelation.findOne({
        $or: [
          { $and: [{ user1: req.user?._id }, { user2: reciever_id }] },
          { $and: [{ user1: reciever_id }, { user2: req.user?._id }] },
        ],
      });

      if (doesRelationAlreadyExists) {
        return res.status(400).send("Relation already exists");
      } else {
        const newChatRel = new ChatRelation({
          user1: req.user?._id,
          roomcode: roomcode,
          user2: reciever_id,
        });

        const savedChatRel = await newChatRel.save();

        if (savedChatRel) {
          const theUser = await User.findById(reciever_id);
          if (theUser) {
            return res.status(200).json({ username: theUser.username, createdAt: savedChatRel.createdAt, 
              roomcode:savedChatRel.roomcode, profile_photo:theUser.profile_photo, 
              reciever:savedChatRel.user2, sender:savedChatRel.user1 });
          } else {
            return res.status(400).send("User not found");
          }
        } else {
          return res.status(400).send("Something went wrong");
        }
      }
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};



exports.GetUserProfile = async (req,res,next) => {
  try {
    const userProfile = await User.find(req.user._id).select('-phone -password -emailVerificationToken -emailVerificationTokenExpiry')
    if(userProfile){
      return res.status(200).send(userProfile)
    }else{
      return res.status(400).send("User not found")
    }
  } catch (error) {
    return res.status(400).send(error.message)
  }
}


exports.GetChatRelations = async (req, res, next) => {
  try {
    const chatRelations = await ChatRelation.find({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ]
    });

    if (chatRelations.length > 0) {
      const userIds = chatRelations.reduce((acc, relation) => {
        if (relation.user1.toString() !== req.user._id.toString()) {
          acc.push(relation.user1);
        }
        if (relation.user2.toString() !== req.user._id.toString()) {
          acc.push(relation.user2);
        }
        return acc;
      }, []);

      const users = await User.find(
        { _id: { $in: userIds } },
        { username: 1, profile_photo: 1 }
      );

      const chatRelationsWithUsernamesAndPhotos = await Promise.all(
        chatRelations.map(async (relation) => {
          const otherUser = users.find((user) => {
            return (
              user._id.toString() === relation.user1.toString() ||
              user._id.toString() === relation.user2.toString()
            );
          });

          const latestMessage = await Message.findOne({ roomcode: relation.roomcode })
            .sort({ createdAt: -1 })
            .select('message sender createdAt');

          return {
            _id: relation._id,
            user1: relation.user1,
            user2: relation.user2,
            roomcode: relation.roomcode,
            username: otherUser ? otherUser.username : null,
            profilePhoto: otherUser ? otherUser.profile_photo : null,
            myId: req.user._id,
            latestMessage: latestMessage ? latestMessage.message : null,
            latestMessageSender: latestMessage ? latestMessage.sender : null,
            latestMessageTime: latestMessage ? latestMessage.createdAt : null
          };
        })
      );

      return res.status(200).send(chatRelationsWithUsernamesAndPhotos);
    }

    return res.status(400).send("You have no Chats");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

exports.GetUserInfo = async (req, res, next) => {
  try {
    const userInfo = await User.findById(req.user._id).select('-password -emailVerificationToken');

    if (!userInfo) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ads = await Ads.find({ provider: userInfo._id })
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({ userInfo, ads });
  } catch (error) {
    next(error);
  }
};


exports.UpdateProfilePhoto = async (req,res,next) => {
  const {profile} = req.body
  try {
    const finandupdate = await User.findByIdAndUpdate(req.user._id,{$set:{profile_photo:profile}})
    if(finandupdate){
      return res.status(200).send("Update successfull")
    }else{
      return res.status(400).send("Could not update profile")
    }
  } catch (error) {
    return res.status(400).send("Something went wrong")
  }
}




exports.UpdateUserInfo = async (req, res, next) => {


  try {
    const { username, phone } = req.body
    const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { username, phone });
    if (updatedUser) {
      createNotification(updatedUser._id, 'profile-update');
      return res.status(200).send("User updated")
    } else {
      return res.status(400).send("Something went wrong")
    }
  } catch (error) {
    return res.status(400).send(error.message)
  }
}

exports.IsAuth = async (req,res,next) => {
  try {
    if(req.user){
      return res.status(200).send({isAuth:true})
    }
    else{
      return res.status(401).send({isAuth:false})
    }
  } catch (error) {
    return res.status(400).send("Some error occured")
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
