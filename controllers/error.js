exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "",
    isAuthenticated: req.session.isLoggedin,
  });
  // res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
};

exports.get500 = (req, res, next) => {
  res.status(404).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedin,
  });
  // res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
};
