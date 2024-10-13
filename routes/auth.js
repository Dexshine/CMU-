const express = require("express");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { GOOGLE_CLIENT_ID, JWT_SECRET } = require("../variable-config");

const router = express.Router();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.post("/google", async (req, res) => {
  const { token } = req.body;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const { sub: googleId, name, email, picture } = response.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ googleId, name, email, picture });
      await user.save();
    }

    const payload = { id: user._id, name: user.name, email };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });

    // res.status(200).json({ accessToken, user, googleData: response.data });
    res.status(200).json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Google login failed" });
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // res.send(req.user); // Sending user's profile in the response
    res.redirect("/");
  }
);

router.get("/profile", (req, res) => {
  res.send(`Hello, ${req.user}`);
});

module.exports = router;
