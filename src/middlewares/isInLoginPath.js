module.exports = async (req, res, next) => {
  if (req.cookies.username) {
    res.redirect("/");
  } else {
    next();
  }
};