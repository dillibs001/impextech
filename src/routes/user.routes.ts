import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import {requireLogin} from "../middleware/auth.middleware.js";

const router = Router();

// Route: GET /api/users
router.get("/",requireLogin, isAdmin, userController.getUsersController);

// Route: GET /api/users/:id
router.get("/:id", requireLogin, userController.getUserController);

// Route: PUT /api/users/:id
router.put("/:id", requireLogin, userController.updateUserController);

// Route: DELETE /api/users/:id
router.delete("/:id", requireLogin, isAdmin, userController.deleteUserController);

export default router;