const Sequelize = require("../database/connection");
const Product = require("../models/Products");
const model = require("../models/Purchases");
const PurchasesDetails = require("../models/PurchasesDetails.js");
const SalesDetails = require("../models/SalesDetails.js");
const utils = require("../helpers/utils");
const { updateStock } = require("../helpers/utils2");
const db = require("../helpers/db");

const getTotalSales = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query);
    res.status(200).json(
      await db.getItemsReport(SalesDetails, query, {
        attributes: [
          [
            // Note the wrapping parentheses in the call below!
            sequelize.literal(`(
                COUNT(distinct saleId)
            )`),
            "salesQty",
          ],
          [
            sequelize.literal(`(
                SUM(purchasePrice*qty)
            )`),
            "totalCost",
          ],
          [
            sequelize.literal(`(
                SUM(salePrice*qty)
            )`),
            "totalSales",
          ],
        ],
      })
    );
  } catch (error) {
    utils.handleError(res, error);
  }
};

const getTotalPurchases = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query);
    res.status(200).json(
      await db.getItemsReport(PurchasesDetails, query, {
        attributes: [
          [
            // Note the wrapping parentheses in the call below!
            sequelize.literal(`(
                COUNT(distinct purchaseId)
            )`),
            "purchasesQty",
          ],
          [
            sequelize.literal(`(
                SUM(purchasePrice*qty)
            )`),
            "totalPurchases",
          ],
        ],
      })
    );
  } catch (error) {
    utils.handleError(res, error);
  }
};

module.exports = {
  getTotalSales,
  getTotalPurchases,
};
