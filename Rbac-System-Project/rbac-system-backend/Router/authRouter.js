import express from "express";
import {
  activateAccount,
  login,
  resetPassword,
} from "../authorization/authController.js";

import {
  validateLogin,
  validateActivate
} from "../middleware/validator.js";

import requestReset from "./resetRouter.js";
import { validationResult } from "express-validator";
import AdminRouter from "./admin.js";

const AuthRouter = express.Router();

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  next();
};


AuthRouter.post('/activate', validateActivate, runValidation, activateAccount);


AuthRouter.post('/login', validateLogin, runValidation, login);

AuthRouter.post('/request-reset', requestReset);


AuthRouter.post('/reset-password', resetPassword);

export default AuthRouter;
