const router = require("express").Router();

//#region IMPORTS
const {
  signupController,
  activateAccountController,
  signinController,
  refreshTokenController,
  signoutController,
} = require("../controllers/auth.controller");
const {
  checkEmail,
  checkUsername,
} = require("../middlewares/userAvailabilityChecker");
//#endregion

/**
 * @description Sign-up user
 * @name post/signup
 */
router.post("/signup", checkEmail, checkUsername, signupController);

/**
 * @description activate and register user
 * @name post/activate
 */
router.post("/activate", checkEmail, checkUsername, activateAccountController);

/**
 * @description Sign-in user
 * @name post/signin
 */
router.post("/signin", signinController);

/**
 * @description refresh token
 * @name post/refresh-token
 */
router.post("/refresh-token", refreshTokenController);

// FIXME: Signout route
router.get("/signout", signoutController);

module.exports = router;
