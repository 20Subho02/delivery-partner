import express from 'express'
import { authControl, loginUser, registerUser } from '../controllers/UserController.js';
import authMiddleware from '../middleware/auth.js';
import { getOrdersController }  from '../controllers/OrderController.js';

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post('/getUserData',authMiddleware,authControl);
userRouter.get('/placecod',getOrdersController)

export default userRouter;