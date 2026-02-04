import { Router } from "express";
import {
  registerOrganization,
  orgLogin,
} from "../controllers/org.controller";

const router = Router();

router.post("/register", registerOrganization);
router.post("/login", orgLogin);

export default router;
