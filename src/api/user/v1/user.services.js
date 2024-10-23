const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user.schema");
const { Matches } = require("../../../models/matches.schema");
const { notification } = require("../../../configs/firebase.config");
const notificationCreator = require("../../../utility/notification.creator");
const {
  createNotificaton,
} = require("../../notifications/v1/notifications.services");

const signUp = async ({ body }) => {
  try {
    const { email, phone, fullName, password, firebaseToken } = body;

    const user = await User.findOne({ email: email.toLowerCase() });


    if (user) {
      return {
        status: 409,
        message: "User already exists with this credentials.",
      };
    }

    const newUser = {
      email: email.toLowerCase(),
      phone,
      otp,
      otpTime: new Date(),
      fullName,
      password: encryptedPassword,
      firebaseToken,
    };

    const register = await User.create(newUser);

    return { status: 200, data: register };
  } catch (error) {
    console.log(`signUp: `, error);
    return null;
  }
};

const login = async ({ body }) => {
  try {
    const { email, password, firebaseToken } = body;

    const user = await User.findOne({ email: email.toLowerCase() });

    let match = null;

    if (user?.password) {
      match = await bcrypt.compare(password, user.password);
    }

    if (match) {
    
        await User.findByIdAndUpdate(user.id, { firebaseToken });
        return {
          status: 200,
          data: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isVerified: user.isVerified,
            isProfileCompleted: user.isProfileCompleted,
            token: jwt.sign(
              {
                id: user.id,
              },
              process.env.SECRET_KEY,
              { expiresIn: "30d" }
            ),
          },
        };
      }
     else {
      return { status: 401, message: "Wrong Credentials" };
    }
  } catch (error) {
    console.log(`login: `, error);
    return null;
  }
};

const getRecommendations = async ({ query, userId }) => {
  try {
    const { offset = 0 } = query;

    let users = await Matches.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recommendations",
          foreignField: "_id",
          as: "recommendations",
        },
      },
      {
        $addFields: {
          recommendations: {
            $map: {
              input: "$recommendations",
              as: "rec",
              in: {
                _id: "$$rec._id",
                fullName: "$$rec.fullName",
                profile: "$$rec.profile",
                birthday: "$$rec.birthday",
                occupation: "$$rec.occupation",
                bioDescription: "$$rec.bioDescription",
                isRequested: {
                  $cond: {
                    if: { $in: ["$$rec._id", "$sentRequests"] },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$recommendations",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$recommendations",
        },
      },
      {
        $sort: {
          fullName: 1,
        },
      },
      {
        $skip: Number(offset),
      },
      {
        $limit: 10,
      },
    ]);

    return { status: 200, data: users };
  } catch (error) {
    console.log(`getRecommendations: `, error);
    return null;
  }
};

const sendConnectionRequest = async ({ body, userId }) => {
  try {
    const { userId: receiverUserId } = body;

    await Matches.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $addToSet: { sentRequests: receiverUserId },
        $pull: { recommendations: receiverUserId },
      },
      {
        upsert: true,
      }
    );

    await Matches.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(receiverUserId) },
      {
        $addToSet: { receievedRequests: userId },
      },
      {
        upsert: true,
      }
    );

    const user = await User.findById(receiverUserId);

    if (user.firebaseToken) {
      notification
        .messaging()
        .send(
          notificationCreator(
            "single",
            "Request Received!",
            "New connection request received! Review and respond to it.",
            user.firebaseToken
          )
        )
        .then(async (response) => {
          console.log("Successfully sent message:", response);
          await createNotificaton({
            body: {
              title: "Request Received!",
              body: "New connection request received! Review and respond to it.",
            },
            userId: receiverUserId,
          });
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }

    return { status: 200, data: true };
  } catch (error) {
    console.log(`sendConnectionRequest: `, error);
    return null;
  }
};

module.exports = {
  signUp,
  login,
  getRecommendations,
  sendConnectionRequest,
};
