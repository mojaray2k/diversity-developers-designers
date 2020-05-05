const express = require("express");
const router = express.Router();

/**
 * @method GET
 * @route api/posts
 * @description Get all posts
 * @callback function @param request @param response
 * @access Public
 */
router.get("/", (req, res) => res.send("Posts route"));

module.exports = router;
