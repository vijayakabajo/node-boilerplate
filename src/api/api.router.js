const checkToken = require("../middlewares/guards/checkToken");

const router = require("express").Router({ mergeParams: true });

router.use("/auth", require("./auth/version.router"));
router.use("/user", checkToken, require("./user/version.router"));

module.exports = router;
