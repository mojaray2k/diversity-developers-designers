const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require("normalize-url");

/**
 * @method GET
 * @route api/profile/me
 * @description Fetch current user profile
 * @callback function @param request @param response
 * @access Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: "There is no profile for this user" }] });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @method POST
 * @route api/profile
 * @description Create or update a current user profile
 * @callback function @param request @param response
 * @access Private
 */
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    const profileFields = {
      user: req.user.id,
      company,
      location,
      website: website === "" ? "" : normalize(website, { forceHttps: true }),
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => " " + skill.trim()),
      status,
      githubusername,
    };

    // Build social object and add to profileFields
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
      if (value && value.length > 0)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @method GET
 * @route api/profile
 * @description Fetch all user profiles
 * @callback function @param request @param response
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @method GET
 * @route api/profile/user/:user_id
 * @description Fetch profile by User ID
 * @callback function @param request @param response
 * @access Public
 */
router.get("/user/:user_id", async ({ params: { user_id } }, res) => {
  // check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(user_id))
    return res.status(400).json({ msg: "Invalid user ID" });

  try {
    const profile = await Profile.findOne({
      user: user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
