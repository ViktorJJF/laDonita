const { Op } = require("sequelize");
const model = require("../models/Products");
const utils = require("../helpers/utils");
const db = require("../helpers/db");

/** *******************
 * Private functions *
 ******************** */

const UNIQUEFIELDS = [];

const itemExistsExcludingItself = async (id, body) =>
  new Promise((resolve, reject) => {
    const query = UNIQUEFIELDS.length > 0 ? {} : { noFields: true };
    if (UNIQUEFIELDS.length === 0) return resolve(false);
    for (const uniquefield of UNIQUEFIELDS) {
      query[uniquefield] = body[uniquefield];
    }
    query.id = {
      [Op.ne]: parseInt(id),
    };
    model
      .findOne({ where: query })
      .then((item) => {
        utils.itemAlreadyExists(null, item, reject, "Este registro ya existe");
        resolve(false);
      })
      .catch((err) => console.log(err));
  });

const itemExists = async (body) =>
  new Promise((resolve, reject) => {
    const query = UNIQUEFIELDS.length > 0 ? {} : { noFields: true };
    if (UNIQUEFIELDS.length === 0) return resolve(false);
    for (const uniquefield of UNIQUEFIELDS) {
      query[uniquefield] = body[uniquefield];
    }
    model
      .findOne({ where: query })
      .then((item) => {
        utils.itemAlreadyExists(null, item, reject, "Este registro ya existe");
        resolve(false);
      })
      .catch((err) => console.log(err));
  });

/**
 * Gets all items from database
 */

const listAll = async (req, res) => {
  try {
    res.status(200).json(await db.getAllItems(model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const list = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query);
    res.status(200).json(await db.getItems(req, model, query));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const listOne = async (req, res) => {
  try {
    res.status(200).json(await db.getItem(req.params.id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    // req.body.userId = req.user._id;
    const doesItemExists = await itemExists(req.body);
    if (!doesItemExists) {
      res.status(200).json(await db.createItem(req.body, model));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};
const update = async (req, res) => {
  try {
    // req.body.userId = req.user._id;
    const doesItemExists = await itemExistsExcludingItself(
      req.params.id,
      req.body
    );
    if (!doesItemExists) {
      res.status(200).json(await db.updateItem(req.params.id, model, req.body));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};
const deletes = async (req, res) => {
  try {
    res.status(200).json(await db.deleteItem(req.params.id, model));
  } catch (error) {
    utils.handleError(res, error);
  }
};

module.exports = {
  list,
  listAll,
  listOne,
  create,
  update,
  deletes,
};
