const Sequelize = require("../database/connection");
const Product = require("../models/Products");
const Brands = require("../models/Brands");
const model = require("../models/Purchases");
const PurchasesDetail = require("../models/PurchasesDetails.js");
const utils = require("../helpers/utils");
const { updateStock } = require("../helpers/utils2");
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

const getTotal = async (req, res) => {
  try {
    // recibiendo id de producto a filtrar
    const productId = req.query.productId;
    const query = await db.checkQueryString(req.query);
    // borando id de query
    delete query["productId"];
    let includeProducts = {
      model: Product,
      required: true,
    };
    if (productId) {
      includeProducts["where"] = {
        id: productId,
      };
    }
    res.status(200).json(
      await db.getItems(
        req,
        model,
        query,
        [
          {
            model: PurchasesDetail,
            required: true,
            include: [includeProducts],
          },
        ],
        {
          attributes: [
            [
              // Note the wrapping parentheses in the call below!
              sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM purchases_details AS purchases_detail
                    WHERE
                        purchases_detail.purchaseId = purchases.id
                )`),
              "cantidad_detalles",
            ],
          ],
        }
      )
    );
  } catch (error) {
    utils.handleError(res, error);
  }
};

const list = async (req, res) => {
  try {
    // recibiendo id de producto a filtrar
    const productId = req.query.productId;
    const query = await db.checkQueryString(req.query);
    // borando id de query
    delete query["productId"];
    let includeProducts = {
      model: Product,
      required: true,
    };
    if (productId) {
      includeProducts["where"] = {
        id: productId,
      };
    }
    res.status(200).json(
      await db.getItems(req, model, query, [
        {
          model: PurchasesDetail,
          required: true,
          include: [
            {
              model: Product,
              required: true,
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
      throw utils.buildErrObject(422, "No agregaste productos a la compra");
    if (!req.body.providerId)
      throw utils.buildErrObject(422, "Selecciona algún proveedor");
    //begin transaction
    let createdPurchase, purchasedProducts;
    try {
      await Sequelize.transaction(async (t) => {
        //create sale
        createdPurchase = await db.createItem(req.body, model, t);
        //adding new sale id to products
        for (const product of products) {
          product.purchaseId = createdPurchase.payload.id;
        }
        //creating purchases details rows
        purchasedProducts = await Promise.all(
          products.map((product) => db.createItem(product, PurchasesDetail, t))
        );
        purchasedProducts = purchasedProducts.map(
          (purchasedProduct) => purchasedProduct.payload
        );
        for (const product of purchasedProducts) {
          await updateStock(product.productId, parseInt(product.qty), t);
        }
      });
    } catch (error) {
      console.log(error);
      throw utils.buildErrObject(
        422,
        "Algo salió mal... intenta agregar tu compra de nuevo"
      );
    }
    //return sale id with products
    res.status(200).json({
      ok: true,
      payload: {
        products: purchasedProducts,
        ...createdPurchase.payload,
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
  getTotal,
};
