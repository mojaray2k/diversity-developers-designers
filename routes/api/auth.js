const express = require("express");
const router = express.Router();

/**
 * @method GET
 * @route api/auth
 * @description Get authenticated user
 * @callback function @param request @param response
 * @access Public
 */
router.get("/", (req, res) => res.send("Auth route"));

module.exports = router;
