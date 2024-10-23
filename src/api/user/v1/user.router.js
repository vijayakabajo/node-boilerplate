const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

const validator = require("../../../validator/validator");
const { userSchemas } = require("../../../validator/schemas");
const isVerified = require("../../../middlewares/guards/isVerified");

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */


/**
 * @swagger
 * /apis/user/v1/recommendations:
 *  get:
 *      summary: get list of recommendations
 *      tags:
 *          - user
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: offset
 *            schema:
 *              type: integer
 *      responses:
 *          default:
 *              description: response
 */
router.get(
  "/recommendations",
  validator(userSchemas.getRecommendations, "query"),
  userController.getRecommendations
);

/**
 * @swagger
 * /apis/user/v1/connectionRequest:
 *  post:
 *      summary: send connection request to a user
 *      tags:
 *          - user
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: string
 *      responses:
 *          default:
 *              description: response
 */
router.post(
  "/connectionRequest",
  validator(userSchemas.sendConnectionRequest, "body"),
  userController.sendConnectionRequest
);



module.exports = router;
