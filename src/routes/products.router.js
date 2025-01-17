import { Router } from "express";
import ProductManager from "../managers/productsManager.js";
import { __dirname } from "../utils.js";

const manager = new ProductManager(__dirname + "/files/products.json");
const router = Router();

router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await manager.getProducts();
  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.status(200).json(limitedProducts);
  } else {
    res.status(200).json(products);
  }
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductsById(id);
  if (product === "Not Found") {
    res.status(400).json({ message: "Producto no encontrado" });
  } else if (product) {
    res.status(200).json(product);
  } else {
    res.status(400).json({ message: "Producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await manager.addProduct(req.body);
    if (product === "The insert code already exists") {
      res.status(400).json({ message: "Error al crear el producto", product });
    } else if (product === "Complete all fields") {
      res.status(400).json({ message: "Error al crear el producto", product });
    } else {
      res.status(201).json({ message: "Producto creado", product });
    }
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({
      message: "Error interno del servidor al crear el producto",
      error: error.message,
    });
  }
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.updateProduct(id, req.body);
  if (product) {
    res.status(200).json({ message: "Producto actualizado", product });
  } else {
    res.status(400).json({ message: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.deleteProduct(id);
  if (product === `Can't find product with id : ${id}`) {
    res.status(400).json({ message: "Error al eliminar el producto", product });
  } else if (product) {
    res.status(200).json({ message: "Producto eliminado", product });
  } else {
    res.status(400).json({ message: "Error al eliminar el producto" });
  }
});

export default router;