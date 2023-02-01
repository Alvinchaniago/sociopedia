import jwt from "jsonwebtoken";

/* Next allows the function to continue */
export const verifyToken = async (req, res, next) => {
  try {
    /* Grab the authorization from the header (token is located inside the header) */
    /* Use let to modify the token content below with the slice method */
    let token = req.header("Authorization");
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    /* Token will be taken after the bearer */
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
