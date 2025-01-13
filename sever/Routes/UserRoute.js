import express from "express";
import { UnFollwUser, deleteUser, followUser, getAllUsers ,getUser, updateUser } from "../Controllers/UserController.js";
import authMiddleware from "../Middlerware/authMiddleware.js";

const router = express.Router();


router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.put('/:id/follow', authMiddleware, followUser);
router.put('/:id/unfollow', authMiddleware, UnFollwUser);

export default router;



