const { User } = require("../../models/user.schema");

const isVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.isVerified) {
      next();
    } else {
      return res.status(401).json({
        message: "Not Verfied.",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Not Verfied.",
    });
  }
};

module.exports = isVerified;
