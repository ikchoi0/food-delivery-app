module.exports = {
  handleAlreadyLoggedIn(req, res, next = ()=>{}) {
    if (req.session.loggedIn) {
      if (req.session.email === "owner@owner.com") {
        return res.redirect("/api/owner");
      }
      return res.redirect("/api/menu");
    } else {
      next();
    }
  },
  authenticateUser(req, res, next) {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    next();
  }
}
