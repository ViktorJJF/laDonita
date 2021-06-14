var multer = require("multer");
const express = require("express");
const passport = require("passport");
const controller = require("../../controllers/images.controller");
// const AuthController = require('../../controllers/authController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadImg = multer({ storage: storage }).single("img");

const router = express.Router();
// require('../../config/passport');

// const requireAuth = passport.authenticate('jwt', {
//   session: false,
// });

/*
 * Create new item route
 */
router.post(
  "/",
  // requireAuth,
  // AuthController.roleAuthorization(['ADMIN']),
  uploadImg,
  controller.create
);

// /*
//  * Delete item route
//  */
router.delete(
  "/:id",
  // requireAuth,
  // AuthController.roleAuthorization(['ADMIN']),
  controller.deletes
);

module.exports = router;
