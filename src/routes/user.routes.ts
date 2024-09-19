import { Router } from "express";

import { createUser, loginUser, logout } from "../controller/user.controller";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", logout);
export default router;
