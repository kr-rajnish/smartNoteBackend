const express = require("express");
// const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./confige/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");

const app = express();

// Allow frontend origin here
app.use(
  cors({
    origin: "http://localhost:5173", // replace with your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    //validation of data
    validateSignupData(req);

    const { fullName, emailId, password } = req.body;

    //hashing password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      fullName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

//login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log("token", token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.fullName,
          emailId: user.emailId,
        },
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

//Get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("cookies", req.cookies);
    res.send(user.fullName + " " + "sent a connection request");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/logout", userAuth, (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logout successful" });
});

connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
  });
