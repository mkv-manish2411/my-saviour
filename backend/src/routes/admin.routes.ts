import { Router } from "express";
import {
  adminLogin,
  getPendingOrgs,
  approveOrg,
} from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

router.post("/login", adminLogin);
router.get("/pending", authenticate, isAdmin, getPendingOrgs);
router.put("/approve/:id", authenticate, isAdmin, approveOrg);

export default router;
