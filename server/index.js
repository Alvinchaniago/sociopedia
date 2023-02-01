/* EXTERNAL PACKAGES */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

/* NODE NATIVE PACKAGES IMPORT */
/* PATH CONFIGURATION PACKAGES FOR DIRECTORIES */
import path from "path";
import { fileURLToPath } from "url";

/* PROJECT IMPORT */
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
/* import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js"; */

/* CONFIGURATION */
/* This is related to the type: module property inside the package.json */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

/* MIDDLEWARE CONFIGURATION */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* SET THE DIRECTORY TO KEEP ALL THE ASSETS (STORED IMAGES) */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE CONFIGURATION */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
/* USE THIS VARIABLE ANYTIME WHEN AN UPLOAD IS REQUIRED */
const upload = multer({ storage });

/* ROUTES WITH FILES */
/* NOTES */
/* The app.post takes in 3 params, first one is the path/route that is used for user registration purposes */
/* Upload.single is the middleware function that interacts with the local file storage, and uploads the image to the "public/assets" folder */
/* Upload is the middleware function that is run before it hits the API endpoint */
/* And lastly the 3rd param is the function/logic/controller that actually registers a new user */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE CONFIGURATION */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    /* IMPORTANT */
    /* ADD THIS MOCK DATA ONE TIME WHEN THE SERVER STARTS */
    /* User.insertMany(users);
    Post.insertMany(posts); */
  })
  .catch((error) => console.log(`${error} failed to connect`));
