const Sequelize = require("../database/connection");
const { Op } = require("sequelize");
const model = require("../models/Sales");
const SalesDetail = require("../models/SalesDetails.js");
const Product = require("../models/Products.js");
const utils = require("../helpers/utils");
const { updateStock } = require("../helpers/utils2");
const db = require("../helpers/db");
const Brands = require("../models/Brands");

//Public functions
const stockAvailable = async (productId, qty) => {
  try {
    let product = await Product.findOne({ where: { id: productId } });
    return product.stock >= qty;
  } catch (error) {
    throw error;
  }
};

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
    res.status(200).json(
      await db.getItems(req, model, query, [
        {
          model: SalesDetail,
          required: true,
          include: [
            {
              model: Product,
              required: false,
              include: [{ model: Brands, required: false }],
            },
          ],
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
    // req.body.userId = req.user.id;
    //populate with sold products
    let products = req.body.products;
    //validations
    if (products.length === 0)
      throw utils.buildErrObject(422, "No agregaste productos a la venta");
    for (const product of products) {
      if (
        !(await stockAvailable(product.productId, product.qty)) &&
        !product.history
      )
        throw utils.buildErrObject(422, "No cuentas con stock suficiente...");
    }
    //begin transaction
    let createdSale, soldProducts;
    try {
      await Sequelize.transaction(async (t) => {
        //create sale
        createdSale = await db.createItem(req.body, model, t);
        //adding new sale id to products
        for (const product of products) {
          product.saleId = createdSale.payload.id;
        }
        //creating sales details rows
        soldProducts = await Promise.all(
          products.map((product) => db.createItem(product, SalesDetail, t))
        );
        soldProducts = soldProducts.map((soldProduct) => soldProduct.payload);
        for (const product of soldProducts) {
          await updateStock(product.productId, -product.qty, t);
        }
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
      payload: {
        products: soldProducts,
        ...createdSale.payload,
      },
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
const update = async (req, res) => {
  try {
    // req.body.userId = req.user.id;
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
    const id = req.params.id;
    //begin transaction
    let deletedItemPayload;
    try {
      await Sequelize.transaction(async (t) => {
        //delete sale
        deletedItemPayload = await db.deleteItem(id, model, t);
        //delete sale details
        let salesDetails = await SalesDetail.findAll({ where: { saleId: id } });
        for (const salesDetail of salesDetails) {
          await db.deleteItem(salesDetail.id, SalesDetail, t);
          //update stock
          await updateStock(salesDetail.productId, salesDetail.qty, t);
        }
      });
    } catch (error) {
      console.log(error);
      throw utils.buildErrObject(
        422,
        "Algo salió mal... intenta eliminar tu venta de nuevo"
      );
    }
    res.status(200).json(deletedItemPayload);
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
