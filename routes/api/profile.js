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
 * @param {function}auth
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
 * @param {function}auth
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

/**
 * @method DELETE
 * @route api/profile
 * @description Delete profile, user, and posts
 * @param {function}auth
 * @callback function @param request @param response
 * @access Private
 */
router.delete("/", auth, async (req, res) => {
  try {
    /**
     * @todo Remove user posts
     **/

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @method Put
 * @route api/profile/experience
 * @description Add profile experience
 * @param {function}auth
 * @callback function @param request @param response
 * @access Private
 */
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @method PUT
 * @route api/profile/experience/:exp_id
 * @description Update profile experience
 * @param {function}auth
 * @callback function @param request @param response
 * @access Private
 */
router.put("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findById({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    foundProfile.experience.set(request.body);
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @method DELETE
 * @route api/profile/experience/:exp_id
 * @description DELETE profile experience
 * @param {function}auth
 * @callback function @param request @param response
 * @access Private
 */
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
