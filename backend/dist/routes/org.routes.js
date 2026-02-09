"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_controller_1 = require("../controllers/org.controller");
const router = (0, express_1.Router)();
router.post("/register", org_controller_1.registerOrganization);
router.post("/login", org_controller_1.orgLogin);
exports.default = router;
