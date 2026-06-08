const linkService = require("../services/link.service");

async function listLinks(req, res, next) {
  try {
    const links = await linkService.listLinks(req.user.id);
    res.json({ links });
  } catch (error) {
    next(error);
  }
}

async function createLink(req, res, next) {
  try {
    const link = await linkService.createLink(req.user.id, req.body);
    res.status(201).json({ link });
  } catch (error) {
    next(error);
  }
}

async function getLink(req, res, next) {
  try {
    const link = await linkService.getOwnedLink(req.user.id, req.params.id);
    res.json({ link });
  } catch (error) {
    next(error);
  }
}

async function updateLink(req, res, next) {
  try {
    const link = await linkService.updateLink(req.user.id, req.params.id, req.body);
    res.json({ link });
  } catch (error) {
    next(error);
  }
}

async function deleteLink(req, res, next) {
  try {
    await linkService.deleteLink(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const analytics = await linkService.getAnalytics(req.user.id, req.params.id);
    res.json({ analytics });
  } catch (error) {
    next(error);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const stats = await linkService.getDashboardStats(req.user.id);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listLinks,
  createLink,
  getLink,
  updateLink,
  deleteLink,
  getAnalytics,
  getDashboardStats
};
