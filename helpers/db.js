const { Op } = require("sequelize");
const { buildErrObject, itemNotFound } = require("./utils");
const { startOfDay, endOfDay } = require("date-fns");

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = [[sort, order == "1" ? "ASC" : "DESC"]];
  return sortBy;
};

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = (result, limit, page) => {
  // result.docs.map((element) => delete element.id);
  let parsedPage = parseInt(page);
  result = renameKey(result, "count", "totalDocs");
  result["limit"] = limit;
  result["page"] = parsedPage;
  result["totalPages"] = Math.ceil(result.totalDocs / limit);
  result["prevPage"] = parsedPage != 1 ? parsedPage - 1 : null;
  result["nextPage"] = parsedPage >= result.totalPages ? null : parsedPage + 1;
  result["hasPrevPage"] = result.prevPage ? true : false;
  result["hasNextPage"] = result.nextPage ? true : false;
  result = renameKey(result, "rows", "payload");
  // result.limit=
  return result;
};

function renameKey(object, key, newKey) {
  const clonedObj = { ...object };
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
}

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async (req) =>
  new Promise((resolve) => {
    const order = parseInt(req.query.order, 10) || -1;
    const sort = req.query.sort || "createdAt";
    const sortBy = buildSort(sort, order);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 99999;
    const options = {
      order,
      sort: sortBy,
      page,
      limit,
    };
    resolve(options);
  });

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  listInitOptions,
  renameKey,
  async checkQueryString(query) {
    return new Promise((resolve, reject) => {
      let finalQuery = JSON.parse(JSON.stringify(query));
      try {
        // agregando filtro de rango fecha
        if (
          finalQuery.fieldDate && // este es la fecha a filtrar
          (finalQuery.startDate || finalQuery.endDate)
        ) {
          finalQuery[finalQuery["fieldDate"]] = {
            [Op.between]: [
              startOfDay(new Date(finalQuery.startDate || "1999")),
              endOfDay(new Date(finalQuery.endDate || "2100")),
            ],
          };
          delete finalQuery["fieldDate"];
          delete finalQuery["startDate"];
          delete finalQuery["endDate"];
        }
        if (
          typeof finalQuery.filter !== "undefined" &&
          typeof finalQuery.fields !== "undefined"
        ) {
          const data = {
            [Op.or]: [],
          };
          const array = [];
          // Takes fields param and builds an array by splitting with ','
          const arrayFields = finalQuery.fields.split(",");
          // Adds SQL Like %word% with regex

          arrayFields.map((item) => {
            array.push({
              [item]: { [Op.like]: `%${finalQuery.filter}%` },
            });
            return true;
          });
          // Puts array result in data
          data[Op.or] = array;
          resolve(data);
        } else {
          resolve(finalQuery);
        }
      } catch (err) {
        console.log(err.message);
        reject(buildErrObject(422, "ERROR_WITH_FILTER"));
      }
    });
  },

  /**
   * Gets ALL items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  getAllItems(model) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve({
          ok: true,
          payload: await model.scope("populate").findAll(),
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(req, model, query, populates) {
    const options = await listInitOptions(req);
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        if (query.hasOwnProperty(key)) delete query[key];
      }
    }
    const paginationOptions = {
      limit: options.limit,
      offset: (options.page - 1) * options.limit,
      where: query,
      order: options.sort,
      include: [
        ...(populates
          ? populates
          : model.populates.map((el) => ({ model: el }))),
      ],
      distinct: true,
      subQuery: false,
    };

    if (!req.query.limit) delete paginationOptions["limit"];
    if (!req.query.page) delete paginationOptions["offset"];
    return new Promise(async (resolve, reject) => {
      try {
        resolve({
          ok: true,
          ...cleanPaginationID(
            await model.findAndCountAll(paginationOptions),
            paginationOptions.limit,
            req.query.page
          ),
        });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },
  /**
   * Gets aggregated items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getAggregatedItems(req, model, aggregated) {
    const options = await listInitOptions(req);
    return new Promise((resolve, reject) => {
      model.aggregatePaginate(aggregated, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        } else {
          resolve({ ok: true, ...cleanPaginationID(items) });
        }
      });
    });
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  getItem(id, model) {
    return new Promise(async (resolve, reject) => {
      let payload = await model.scope("populate").findOne({ where: { id } });
      itemNotFound(null, payload, reject, "NOT_FOUND");
      resolve({ ok: true, payload });
    });
  },
  /**
   * Gets item from database by custom fields
   * @param {object} fields - fields
   */
  async filterItems(fields, model) {
    return new Promise((resolve, reject) => {
      model.find(fields, (err, payload) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve({ ok: true, payload });
      });
    });
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  createItem(body, model, session) {
    return new Promise(async (resolve, reject) => {
      try {
        let options = {
          include: [...model.populates.map((el) => ({ model: el }))],
        };
        if (session) options["transaction"] = session;
        const item = await model.create(body, options);
        // await item.reload();
        resolve({ ok: true, payload: JSON.parse(JSON.stringify(item)) });
      } catch (error) {
        reject(buildErrObject(422, error.message));
      }
    });
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  updateItem(id, model, body) {
    return new Promise(async (resolve, reject) => {
      try {
        await model.update(body, { where: { id } });
        let item = await model.scope("populate").findOne({ where: { id } });
        if (!item) {
          return itemNotFound(null, item, reject, "NOT_FOUND");
        }
        resolve({ ok: true, payload: item });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  deleteItem(id, model, t) {
    return new Promise(async (resolve, reject) => {
      try {
        let item = await model.findOne({ where: { id } });
        if (!item) return itemNotFound(null, item, reject, "NOT_FOUND");
        let params = { where: { id } };
        if (t) params["transaction"] = t;
        await model.destroy(params);
        resolve({ ok: true, payload: item });
      } catch (err) {
        reject(buildErrObject(422, err.message));
      }
    });
  },
};
