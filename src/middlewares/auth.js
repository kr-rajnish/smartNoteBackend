const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  //Reade the token from cookie
  //validate the token
  //find the user
  // try {
  //   const cookie = req.cookies;
  //   const { token } = cookie;
  //   if (!token) {
  //     throw new Error("Token not found!!!!!!!!!");
  //   }

  //   const decodeObj = await jwt.verify(token, "secretKey");
  //   const { _id } = decodeObj;

  //   const user = await User.findById(_id);
  //   if (!user) {
  //     throw new Error("User not found");
  //   }
  //   req.user = user;
  //   next();
  // } catch (error) {
  //   res.status(401).send("ERROR:" + error.message);
  // }

  try {
    // First try to get token from Authorization header
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // Fallback to cookie if header is not present
    else {
      token = req.cookies?.token;
    }

    if (!token) {
      throw new Error("Token not found!");
    }

    const decodeObj = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("ERROR: " + error.message);
  }
};

module.exports = { userAuth };
