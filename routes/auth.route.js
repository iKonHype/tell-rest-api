/**
 * @module router/auth
 * @requires module:controller/auth
 * @requires module:middleware/checkpoint
 */

const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const checkpoint = require("../middlewares/checkpoint");

/**
 * Sign-up user
 * @name post/signup
 */
router.post("/signup", checkpoint.checkEmail, auth.signupController);

/**
 * activate and register user
 * @name post/activate
 */
router.post("/activate", checkpoint.checkEmail, auth.activateAccountController);

/**
 * Sign-in user
 * @name post/signin
 */
router.post("/signin", auth.signinController);

/**
 * refresh token
 * @name post/refresh-token
 */
router.post("/refresh-token", auth.refreshTokenController);

// FIXME: Signout route
router.get("/signout", auth.signoutController);

module.exports = router;
