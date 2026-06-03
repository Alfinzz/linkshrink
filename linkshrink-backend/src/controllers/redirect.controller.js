const linkService = require("../services/link.service");

async function redirectToOriginalUrl(req, res, next) {
  try {
    const link = await linkService.getRedirectTarget(req.params.slug);

    if (!link) {
      return res.status(404).json({ message: "Short link not found" });
    }

    await linkService.logClick(link.id, req);
    res.redirect(302, link.originalUrl);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  redirectToOriginalUrl
};
