const express = require("express");
require("dotenv").config();
const connectDB = require("./confige/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");

// **********
const Note = require("./models/notes");

const app = express();
const port = process.env.PORT || 3000;

// Allow frontend origin here (for both local and deployed frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local frontend URL
      "https://smartnotefrontend.onrender.com", // Deployed frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Add any other headers you need
    credentials: true, // Enable sending cookies/credentials with requests
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes and API Definitions
app.get("/api/data", (req, res) => {
  res.json({ message: "CORS is now enabled!" });
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
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

// login API
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
        sameSite: "None",
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
          isFirstLogin: user.isFirstLogin,
        },
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// API to update isFirstLogin status
app.put("/updateFirstLoginStatus", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isFirstLogin: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "First login status updated successfully",
      isFirstLogin: updatedUser.isFirstLogin,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

// API to check isFirstLogin status
app.get("/checkFirstLoginStatus", userAuth, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      isFirstLogin: req.user.isFirstLogin,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

// Get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// *********************
app.post("/createNote", userAuth, async (req, res) => {
  try {
    const note = new Note(req.body);
    const savedNote = await note.save();
    res.send(savedNote);
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

app.get("/getNotes", userAuth, async (req, res) => {
  try {
    const { search, tag } = req.query;
    const query = { user: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const notes = await Note.find(query);
    res.send(notes);
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

app.delete("/deleteNote/:id", userAuth, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    res.send(note);
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

app.put("/updateNote/:id", userAuth, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(note);
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error.message);
  }
});

// Connect to DB and Start Server
connectDB()
  .then(() => {
    console.log("Database is connected");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
  });
