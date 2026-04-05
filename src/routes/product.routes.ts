import { Router } from "express";
// import * as productController from "../controllers/product.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import {expressjwt as checkJwt} from "express-jwt";

const router = Router();

const requireLogin = checkJwt({
    secret: process.env.JWT_SECRET_KEY!,
    algorithms: ["HS256"],
});

// router.post("/products", requireLogin, isAdmin, productController.createProduct);
// router.get("/products", productController.getAllProducts);
// router.get("/products/:id", productController.getProductById);
// router.put("/products/:id", requireLogin, isAdmin, productController.updateProduct);
// router.delete("/products/:id", requireLogin, isAdmin, productController.deleteProduct);

export default router;