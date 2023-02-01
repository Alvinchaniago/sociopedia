/* PROJECT IMPORT */
import Post from "../models/Post.js";
import User from "../models/User.js";

/* =============================== NOTES =============================== */
/* req.body is used to get values sent through html form */
/* req.params us used to get values sent through the url without the key (unlike query string) */
/* In this case for the req.body, inside the createPost function, grab all the values coming from the form and desructure them accordingly */
/* For req.params, inside the getUserPosts function, get the user ID */
/* Within the routes/posts.js there's this function router.get("/:userId/posts", verifyToken, getUserPosts); */
/* Req.params grabs the userId from the URL through getUserPosts inside this controller */
/* ===================================================================== */

/* CREATE FUNCTIONALITY */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    /* =============================== ADD A NEW POST =============================== */
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    /* ============================================================================== */

    /* GET ALL POSTS */
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ FUNCTIONALITY */
export const getFeedPosts = async (req, res) => {
  try {
    /* GET ALL POSTS */
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await Post.find({ userId });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE FUNCTIONALITY */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    /* THIS TIME GET THE USER ID FROM THE BODY */
    const { userId } = req.body;
    const post = await Post.findById(id);
    /* =============================== NOTES =============================== */
    /* CHECK IN THE LIKES MAP IF THE USER ID EXISTS, IF IT DOES THEN DELETE */
    /* REMINDER: INSIDE THE POST MODEL THE LIKES PROPERTY IS OF A KEY-VALUE PAIR (MAP TYPE) */
    /* IT IS IN THE FORM OF KEY(USERID) - VALUE(BOOLEAN) */
    /* THEREFORE IT ONLY CHECKS IF THE USERID IS TRUE OR FALSE INSIDE THE LIKES OBJECT */
    /* ===================================================================== */
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    /* UPDATE THE POST WITH THE MODIFIED LIKES OBJECT */
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
