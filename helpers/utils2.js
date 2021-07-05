const Product = require("../models/Products");

const updateStock = async (productId, qty, session) => {
  try {
    let product = await Product.findOne({
      where: { id: productId },
    });
    await Product.update(
      { stock: product.stock + qty },
      {
        where: { id: productId },
        transaction: session,
      }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  updateStock,
};
