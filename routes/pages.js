const express = require('express');
const router = express.Router();

const wosMiddleware = require('../middleware/wallofshame');

//public routes
router.get('/', (req, res) => {
  res.render('landingpage');
});

router.get('/register', (req, res) => {
  res.render('auth/register', { 'isLoggedIn': req.session.loggedin });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { 'isLoggedIn': req.session.loggedin });
});

router.get('/wallofshame', (req, res) => {
  wosMiddleware.getEntries(req, res, function(messageList) {
    var messageListlocal = messageList;
    var isLoggedIn = req.session.loggedin;
    res.render('tools/wallofshame', { 'messageList': messageListlocal, 'isLoggedIn': isLoggedIn });
  });
});

//protected routes
router.get('/logout', (req, res) => {
  if (req.session.loggedin) {
    req.session.loggedin = false;
    return res.redirect('/tools');
  }

  return res.render('index', { message: "can't log out, not logged in" });
})


module.exports = router;

