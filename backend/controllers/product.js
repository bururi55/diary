const Product = require("../models/Product");

async function getAllProducts(page, limit, search) {
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
  const totalProducts = await Product.countDocuments(query);
  const lastPage = Math.ceil(totalProducts / limit);
  return { products, lastPage };
}

async function addProduct(productData) {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 }).limit(1);
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: newId,
      name: productData.name,
      carbohydratesIn100Grams: productData.carbohydratesIn100Grams,
      proteins: productData.proteins,
      fats: productData.fats,
    });

    await product.save();
    return product;
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw error;
  }
}

async function updateProduct(id, productData) {
  try {
    const product = await Product.findOneAndUpdate({ id: id }, productData, {
      new: true,
    });
    return product;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    await Product.findOneAndDelete({ id: id });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
}

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
