const express = require("express");
const passport = require("passport");
const trimRequest = require("trim-request");
const controller = require("../../controllers/supplies.controller");
const validate = require("../../controllers/supplies.validate");
const AuthController = require("../../controllers/auth.controller");

const router = express.Router();
require("../../config/passport");

const requireAuth = passport.authenticate("jwt", {
  session: false,
});

/*
 * Get all items route
 */
router.get("/all", controller.listAll);

// /*
//  * Get items route
//  */
router.get(
  "/",
  requireAuth,
  AuthController.roleAuthorization(["ADMIN"]),
  trimRequest.all,
  controller.list
);

/*
 * Create new item route
 */
router.post(
  "/",
  requireAuth,
  AuthController.roleAuthorization(["ADMIN"]),
  trimRequest.all,
  validate.create,
  controller.create
);

// /*
//  * Get item route
//  */
router.get(
  "/:id",
  requireAuth,
  AuthController.roleAuthorization(["ADMIN"]),
  trimRequest.all,
  // validate.listOne,
  controller.listOne
);

// /*
//  * Update item route
//  */
router.put(
  "/:id",
  requireAuth,
  AuthController.roleAuthorization(["ADMIN"]),
  trimRequest.all,
  validate.update,
  controller.update
);

// /*
//  * Delete item route
//  */
router.delete(
  "/:id",
  requireAuth,
  AuthController.roleAuthorization(["ADMIN"]),
  trimRequest.all,
  validate.deletes,
  controller.deletes
);

module.exports = router;
