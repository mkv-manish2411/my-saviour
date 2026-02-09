import { Router } from "express";
import {
  getDonors,
  getLastDonation,
   markDonorCta,
  markDonated,
} from "../controllers/donor.controller";
import { authenticate as protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/:id/cta", protect, markDonorCta);

router.get("/", getDonors);
router.get("/last-donation", protect, getLastDonation);
router.post("/donate", protect, markDonated);



export default router;
