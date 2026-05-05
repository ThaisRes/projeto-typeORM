import { Router } from "express";
import { UserController} from "../controller/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../entity/User";

const router = Router();
const userController = new UserController();

router.post("/", userController.create);
router.get("/", userController.list);
router.get("/active", userController.listActive);
router.get("/:id", authMiddleware, userController.listById);
router.delete("/:id", userController.delete);
router.patch("/:id", authMiddleware, userController.update);
router.patch("/:id/toggle", authMiddleware, userController.toggleActive);
router.patch("/role/:id", authMiddleware, roleMiddleware([UserRole.ADMIN]), userController.updateRole);

export const userRoutes = router;