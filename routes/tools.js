const express = require('express');
const router = express.Router();

const db = require('./../middleware/database');
const quake = require('./../middleware/quakerandomizer');

router.get('/', (req, res) => {
  res.render('tools/index', { 'isLoggedIn': req.session.loggedin });
});

router.get('/members', (req, res) => {
  if (req.session.loggedin) {
    var userList = [];
    db.query(`SELECT * FROM users ORDER BY id;`, (err, rows, fields) => {
      if (err) {
        res.status(500).send({
          message: 'internal server error'
        });
      } else {
        for (var i = 0; i < rows.length; i++) {
          var user = {
            'id': rows[i].id,
            'username': rows[i].username,
            'registered': rows[i].registered.getDate() + '.' + (rows[i].registered.getMonth() + 1) + "." + rows[i].registered.getFullYear(),
          }
          userList.push(user);
        }
        res.render('tools/members', { "userList": userList, 'isLoggedIn': req.session.loggedin });
      };
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/hrboost', (req, res) => {
  if (req.session.loggedin) {
    res.render('tools/hrboost', { 'isLoggedIn': req.session.loggedin });
  } else {
    res.redirect('/login');
  }
});

router.get('/quakerandomizer', (req, res) => {
  if (req.session.loggedin) {
    quake.getMapList(req, res, (rollList) => {
      console.log('hello mens me here')
      var tempRollList = rollList;
      var latestUser = tempRollList[0].username;
      var latestMap = tempRollList[0].map;
      var latestRollDate = tempRollList[0].rollDate;
      res.render('tools/quakerandomizer', {
        'rollList': tempRollList,
        'latestUser': latestUser,
        'latestMap': latestMap,
        'latestRollDate': latestRollDate,
        'isLoggedIn': req.session.loggedin
      });
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/rollquakemap', (req, res) => {
  quake.rollRandomMap(req, res);
});

router.get('/software', (req, res) => {
  if(req.session.loggedin) {
    return res.render('tools/software', { 'isLoggedIn': req.session.loggedin});
  };

  return res.redirect('/login');
});

module.exports = router;
