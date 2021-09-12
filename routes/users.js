import { Router } from "express";
import { cleanbody } from "../middlewares/cleanbody";
import { signUp } from  '../src/users/user.controller';

export const router = Router().post('/signup', cleanbody, signUp)
