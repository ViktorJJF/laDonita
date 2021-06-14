const utils = require("../helpers/utils");

const create = async (req, res) => {
  try {
    // req.body.userId = req.user._id;
    // manejo de imagenes
    res.status(200).json({
      ok: true,
      msg: "Imagen creada con éxito",
      payload: req.file.path.replace(/\\/g, "/").substring("public".length),
    });
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
  create,
  deletes,
};
