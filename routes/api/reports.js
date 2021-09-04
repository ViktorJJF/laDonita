const express = require("express");
const passport = require("passport");
const trimRequest = require("trim-request");
const controller = require("../../controllers/reports.controller");
const AuthController = require("../../controllers/auth.controller");

const router = express.Router();
require("../../config/passport");

const requireAuth = passport.authenticate("jwt", {
  session: false,
});

router.get(
  "/total-sales",
  requireAuth,
  AuthController.roleAuthorization(["ADMIN"]),
  trimRequest.all,
  controller.getTotalSales
);

module.exports = router;
