const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

const validator = require("../../../validator/validator");
const { authSchemas } = require("../../../validator/schemas");

/**
 * @swagger
 * /apis/auth/v1/signUp:
 *  post:
 *      summary: register a user
 *      tags:
 *          - auth
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          phone:
 *                              type: string
 *                          fullName:
 *                              type: string
 *                          password:
 *                              type: string
 *                          firebaseToken:
 *                              type: string
 *      responses:
 *          default:
 *              description: response
 */
router.post(
  "/signUp",
  validator(authSchemas.signUp, "body"),
  authController.signUp
);


/**
 * @swagger
 * /apis/auth/v1/login:
 *  post:
 *      summary: login into account
 *      tags:
 *          - auth
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          firebaseToken:
 *                              type: string
 *      responses:
 *          default:
 *              description: response
 */
router.post(
  "/login",
  validator(authSchemas.login, "body"),
  authController.login
);

module.exports = router;
