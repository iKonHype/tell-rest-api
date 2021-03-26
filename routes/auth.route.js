/**
 * @module router/auth
 * @requires module:controller/auth
 * @requires module:middleware/checkpoint
 */

const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const checkpoint = require("../middlewares/checkpoint");

/**
 * @description Sign-up user
 * @name post/signup
 */
router.post("/signup", checkpoint.checkEmail, auth.signupController);

/**
 * @description activate and register user
 * @name post/activate
 */
router.post("/activate", checkpoint.checkEmail, auth.activateAccountController);

/**
 * @description Sign-in user
 * @name post/signin
 */
router.post("/signin", auth.signinController);

/**
 * @description refresh token
 * @name post/refresh-token
 */
router.post("/refresh-token", auth.refreshTokenController);

// FIXME: Signout route
router.get("/signout", auth.signoutController);

module.exports = router;
