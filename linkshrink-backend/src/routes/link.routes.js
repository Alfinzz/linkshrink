const express = require("express");
const linkController = require("../controllers/link.controller");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", linkController.listLinks);
router.post("/", linkController.createLink);
router.get("/:id", linkController.getLink);
router.patch("/:id", linkController.updateLink);
router.delete("/:id", linkController.deleteLink);
router.get("/:id/analytics", linkController.getAnalytics);

module.exports = router;
