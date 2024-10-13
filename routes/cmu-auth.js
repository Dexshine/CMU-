const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/user");

async function getOAuthAccessTokenAsync(authorizationCode) {
  try {
    const response = await axios.post(
      process.env.CMU_OAUTH_GET_TOKEN_URL,
      {},
      {
        params: {
          code: authorizationCode,
          redirect_uri: process.env.CMU_OAUTH_REDIRECT_URL,
          client_id: process.env.CMU_OAUTH_CLIENT_ID,
          client_secret: process.env.CMU_OAUTH_CLIENT_SECRET,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    return null;
  }
}

async function getCMUBasicInfoAsync(accessToken) {
  try {
    const response = await axios.get(process.env.CMU_OAUTH_GET_BASIC_INFO, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return response.data;
  } catch (err) {
    return null;
  }
}

router.post("/signin", async (req, res) => {
  // Validate authorizationCode
  const authorizationCode = req.body.authorizationCode;
  if (typeof authorizationCode !== "string") {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid authorization code" });
  }

  // Get access token
  const accessToken = await getOAuthAccessTokenAsync(authorizationCode);
  if (!accessToken) {
    return res
      .status(400)
      .json({ ok: false, message: "Cannot get OAuth access token" });
  }

  // Get basic info
  const cmuBasicInfo = await getCMUBasicInfoAsync(accessToken);
  if (!cmuBasicInfo) {
    return res
      .status(400)
      .json({ ok: false, message: "Cannot get CMU basic info" });
  }

  // Ensure JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    throw new Error("Please assign jwt secret in .env!");
  }

  let user = await User.findOne({ email: cmuBasicInfo.cmuitaccount });

  if (!user) {
    user = new User({
      studentId: cmuBasicInfo.student_id,
      name: `${cmuBasicInfo.firstname_TH} ${cmuBasicInfo.lastname_TH}`,
      email: cmuBasicInfo.cmuitaccount,
    });
    await user.save();
  }

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  //   res.cookie("cmu-oauth-example-token", token, {
  //     maxAge: 3600 * 1000, // 1 hour
  //     httpOnly: true,
  //     sameSite: "lax",
  //     secure: process.env.NODE_ENV === "production",
  //     path: "/",
  //     domain: "localhost", // Change to your domain in production
  //   });

  return res
    .status(200)
    .json({ ok: true, accessToken: token, user, cmuBasicInfo });
});

module.exports = router;
