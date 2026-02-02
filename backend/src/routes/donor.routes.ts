import { Router } from "express";
import { getDonors } from "../controllers/donor.controller";

const router = Router();

router.get("/", getDonors);

export default router;
