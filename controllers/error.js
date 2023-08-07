exports.getNotFoundPage = (req, res, next) => {
  res.status(404).render('not-found', {
    pageTitle: 'Page Not Found',
    path: '',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getServerErrorPage = (req, res, next) => {
  res.status(500).render('server-error', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};
