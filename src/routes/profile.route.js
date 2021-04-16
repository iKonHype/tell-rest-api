const router = require("express").Router();
const profile = require("../controllers/profile.controller");
const checkpoint = require("../middlewares/checkpoint");

//#region User
/**
 * Get own profile [User]
 * @name get/user-profile
 * @example {base_url}/profile/my/123
 */
router.get(
  "/my/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  profile.getUserProfileController
);

/**
 * Update own profile [User]
 * @name put/update-user
 * @example {base_url}/profile/my/update
 */
router.put(
  "/my/update",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  profile.updateUserController
);

/**
 * Delete user account [Admin|User]
 * @name delete/user
 * @example {base_url}/profile/123
 */
router.delete(
  "/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  profile.deleteUserProfileController
);
//#endregion

//#region Authority
/**
 * Get authority profile [Authority]
 * @name get/pro-profile
 * @example {base_url}/profile/pro/123
 */
router.get(
  "/pro/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAuthority,
  profile.getAuthorityProfileController
);

/**
 * Update own profile [Admin|Authority]
 * @name put/update-user
 * @example {base_url}/profile/pro/update
 */
router.put(
  "/pro/update/",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAuthority,
  profile.updateAuthoritynProfileController
);

/**
 * Delete user account [Admin]
 * @name delete/user
 * @example {base_url}/profile/123
 */
router.delete(
  "/:userId",
  checkpoint.isSignedIn,
  checkpoint.isAuthenticated,
  checkpoint.isAdmin,
  profile.deleteAuthorityProfileController
);
//#endregion

module.exports = router;
