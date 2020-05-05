const express = require("express");
const router = express.Router();

/**
 * @method GET
 * @route api/profile
 * @description Get user profile
 * @callback function @param request @param response
 * @access Public
 */
router.get("/", (req, res) => res.send("Profile route"));

module.exports = router;
