const express = require("express");
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const authenticated = require("../middlewares/authenticated");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = PAGINATION_LIMIT, search = "" } = req.query;
    const { products, lastPage } = await getAllProducts(
      Number(page),
      Number(limit),
      search
    );
    res.send({ data: { products, lastPage } });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/", authenticated, async (req, res) => {
  try {
    const product = await addProduct(req.body);
    res.send({ data: product });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/:id", authenticated, async (req, res) => {
  try {
    const product = await updateProduct(Number(req.params.id), req.body);
    res.send({ data: product });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", authenticated, async (req, res) => {
  try {
    await deleteProduct(Number(req.params.id));
    res.send({ data: { message: "Product deleted successfully" } });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
