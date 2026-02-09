"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const donor_controller_1 = require("../controllers/donor.controller");
const router = (0, express_1.Router)();
router.get("/", donor_controller_1.getDonors);
exports.default = router;
