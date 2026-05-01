import { Router } from "express";
import { UserController} from "../controller/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const userController = new UserController();

router.post("/", userController.create);
router.get("/", userController.list);
router.get("/active", userController.listActive);
router.get("/:id", userController.listById);
router.delete("/:id", userController.delete);
router.patch("/:id", authMiddleware, userController.update);
router.patch("/:id/toggle", userController.toggleActive);

export const userRoutes = router;