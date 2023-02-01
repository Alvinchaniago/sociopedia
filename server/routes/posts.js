/* EXTERNAL PACKAGES */
import express from "express";

/* PROJECT IMPORT */
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
/* GET ALL POSTS AND DISPLAY THEM ON HOME PAGE */
router.get("/", verifyToken, getFeedPosts);
/* GET POSTS BASED ON USER ID */
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
