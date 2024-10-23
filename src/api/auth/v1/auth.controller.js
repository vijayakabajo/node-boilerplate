const responses = require("./../../../utility/responses");

const userServices = require("../../user/v1/user.services");

const signUp = async (req, res) => {
  try {
    const result = await userServices.signUp(req);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const login = async (req, res) => {
  try {
    const result = await userServices.login(req);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status,
        result.data
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  signUp,
  login,
};
