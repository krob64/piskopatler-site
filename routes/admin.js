const express = require('express');
const router = express.Router();
const tsToggle = require('child_process');

const invMiddleware = require('./../middleware/invitecodes');

router.get('/', (req, res) => {
    res.render('admin/adminpage');
})

router.get('/invitecodes', (req, res) => {
  if (req.session.loggedin) {
    invMiddleware.getCodes(req, res, (codeList) => {
      var inviteCodeList = codeList;
      var isLoggedIn = req.session.loggedin;
      res.render('admin/invitecodes',
        { 'invitecodeList': inviteCodeList, 'isLoggedIn': isLoggedIn });
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/teamspeak', (req, res) => {
  if(req.query.t === "off") {
    tsToggle.exec('sh tsOff.sh', (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if(error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
  } else if(req.query.t === "on") {
    tsToggle.exec('sh tsOn.sh', (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if(error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
  }


  res.send('hurre');
  
})

module.exports = router;
