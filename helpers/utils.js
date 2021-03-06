const { validationResult } = require("express-validator");
const requestIp = require("request-ip");

exports.convertToDate = (date) => {
  const preFormated = new Date(date);
  let formatedDate = new Date(
    preFormated.getTime() - preFormated.getTimezoneOffset() * -60000
  );
  return formatedDate;
};

exports.selectRandomId = (collection) =>
  collection[this.Random(0, collection.length - 1)].id;

exports.Random = (min, max) => {
  let newMin = Math.ceil(min);
  let newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1)) + min;
};
/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) =>
  file.split(".").slice(0, -1).join(".").toString();

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = (req) => requestIp.getClientIp(req);

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = (req) => req.headers["user-agent"];

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = (req) =>
  req.headers["cf-ipcountry"] ? req.headers["cf-ipcountry"] : "XX";

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message,
    },
  });
};

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => ({
  code,
  message,
});

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    return next();
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()));
  }
};

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message) => ({
  msg: message,
});

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (!item) {
    reject(this.buildErrObject(404, message));
  }
};

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (item) {
    reject(this.buildErrObject(422, message));
  }
};
