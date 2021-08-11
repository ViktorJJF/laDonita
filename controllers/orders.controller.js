const Sequelize = require("../database/connection");
const { Op } = require("sequelize");
const model = require("../models/Orders");
const OrdersDetails = require("../models/OrdersDetails");
const Dishes = require("../models/Dishes");
const utils = require("../helpers/utils");
const db = require("../helpers/db");

/** *******************
 * Private functions *
 ******************** */

const UNIQUEFIELDS = [];

const itemExistsExcludingItself = async (id, body) =>
  new Promise((resolve, reject) => {
    const query = UNIQUEFIELDS.length > 0 ? {} : { noFields: true };
    for (const uniquefield of UNIQUEFIELDS) {
      query[uniquefield] = body[uniquefield];
    }
    query.id = {
      [Op.ne]: parseInt(id),
    };
    if (UNIQUEFIELDS.length === 0) {
      return resolve(false);
    }
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
    for (const uniquefield of UNIQUEFIELDS) {
      query[uniquefield] = body[uniquefield];
    }
    if (UNIQUEFIELDS.length === 0) {
      return resolve(false);
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
    res.status(200).json(
      await db.getItems(req, model, query, [
        {
          model: OrdersDetails,
          required: false,
          include: [{ model: Dishes, required: false }],
        },
      ])
    );
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
    let dishesDetails = req.body.dishesDetails;
    //validations
    if (dishesDetails.length === 0)
      throw utils.buildErrObject(422, "No agregaste platos al pedido");
    //begin transaction
    let createdOrder, soldDishes;
    try {
      await Sequelize.transaction(async (t) => {
        //create sale
        createdOrder = await db.createItem(req.body, model, t);
        //adding new sale id to products
        for (const dish of dishesDetails) {
          dish.orderId = createdOrder.payload.id;
        }
        //creating sales details rows
        soldDishes = await Promise.all(
          dishesDetails.map((dish) => db.createItem(dish, OrdersDetails, t))
        );
        soldDishes = soldDishes.map((soldDish) => soldDish.payload);
      });
    } catch (error) {
      console.log(error);
      throw utils.buildErrObject(
        422,
        "Algo salió mal... intenta agregar tu venta de nuevo"
      );
    }
    //return sale id with products
    res.status(200).json({
      ok: true,
    });
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
