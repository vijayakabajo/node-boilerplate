const responses = require("./../../../utility/responses");

const userServices = require("./user.services");


const getRecommendations = async (req, res) => {
  try {
    const result = await userServices.getRecommendations(req);
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

const sendConnectionRequest = async (req, res) => {
  try {
    const result = await userServices.sendConnectionRequest(req);
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

module.exports = {
  getRecommendations,
  sendConnectionRequest,
};
