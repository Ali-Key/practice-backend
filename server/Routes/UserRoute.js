import { Router } from 'express';
import validateUser from '../middlewares/validateUser.js';
import verifyToken from '../middlewares/verifyToken.js';
import dotenv from 'dotenv';
import { signIn, signUp, users, user, userUpdate, userDelete } from '../Controlles/UserController.js';

dotenv.config();

const router = Router();

// User - Endpoints
router.post("/signup", validateUser, signUp);
router.post('/signin', signIn);

router.get('/', users);
router.get('/user', verifyToken, user);
router.put('/user', verifyToken, userUpdate);
router.delete('/user', verifyToken, userDelete);

export default router;