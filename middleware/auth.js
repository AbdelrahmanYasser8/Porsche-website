const User = require("../models/User");
const { syncSessionUser } = require("../utils/session");

async function requireAuth(req, res, next) {
  try {
    const sessionUser = req.session?.user;

    if (!sessionUser?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findById(sessionUser.id);

    if (!user) {
      if (req.session) {
        req.session.destroy(() => {});
      }

      return res.status(401).json({ error: "Not authenticated" });
    }

    if (user.status === "Inactive") {
      if (req.session) {
        req.session.destroy(() => {});
      }

      return res.status(403).json({ error: "Account is inactive" });
    }

    req.user = user;
    syncSessionUser(req, user);
    next();
  } catch (error) {
    next(error);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
