const mysql = require('mysql');
const db = require('./database');
const crypto = require('crypto');

function randomString(size = 50, callback) {
  let generatedString = crypto.randomBytes(size).toString('hex').slice(0, size);

  callback(generatedString);
}

exports.getCodes = (req, res, callback) => {
  var codeList = [];
  db.query(`SELECT * FROM invitecodes ORDER BY id;`, (err, rows, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send({
        message: 'internal server error'
      });
    } else {
      for (let i = 0; i < rows.length; i++) {
        var code = {
          'id': rows[i].id,
          'code': rows[i].code,
          'isValid': rows[i].isValid,
          'usedBy': rows[i].usedBy,
          'usedDate': 'not used yet',
          'creationDate': rows[i].creationDate.getDate() + '.' + (rows[i].creationDate.getMonth() + 1) + '.' + rows[i].creationDate.getFullYear(),
        }

        if (code.isValid === 1) {
          code.isValid = 'yes';
        } else {
          code.isValid = 'no';
        }

        if (rows[i].usedDate) {
          code.usedDate = rows[i].usedDate.getDate() + '.' + (rows[i].usedDate.getMonth() + 1) + '.' + rows[i].usedDate.getFullYear();
        };


        codeList.push(code);
      };

      callback(codeList);
    };
  });
}

exports.generateCode = (req, res) => {
  if (req.session.loggedin) {
    randomString(50, (generatedString) => {
      var generatedCode = generatedString;

      db.query("SELECT code FROM invitecodes WHERE code = ?", [generatedCode], (error, result) => {
        if (error) {
          console.log(error);
        };

        if (result.length > 0) {
          return res.render('/admin/invitecodes', {
            message: 'code already exists.'
          });
        };

        db.query(`INSERT INTO invitecodes (code, isValid, creationDate) VALUES ('${generatedCode}', '1', now());`, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            //res.redirect('/admin/invitecodes');
            console.log('hello mens is added code.');
            res.redirect('/admin/invitecodes');
          }

        })
      });
    })
  } else {
    res.redirect('/login');
  };
}
