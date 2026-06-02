function buildSessionUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function syncSessionUser(req, user) {
  const sessionUser = buildSessionUser(user);

  req.session.user = sessionUser;
  return sessionUser;
}

module.exports = {
  buildSessionUser,
  syncSessionUser,
};
