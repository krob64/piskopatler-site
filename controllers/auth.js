const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./../middleware/database');

exports.register = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const invitecode = req.body.invitecode;

  db.query("SELECT username FROM users WHERE username = ?", [username], async (error, result) => {
    if (error) {
      console.log(error);
    }

    if (result.length > 0) {
      return res.render('auth/register', {
        message: 'this username is already in use'
      });
    };

    if (password !== passwordConfirm) {
      return res.render('auth/register', {
        message: 'passwords do not match'
      });
    };

    db.query("SELECT * FROM invitecodes WHERE code = ?", [invitecode], async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length <= 0) {
        console.log(invitecode);
        return res.render('auth/register', {
          message: 'invitecode does not exist'
        });
      };

      if (results[0].isValid === 1) {
        let hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users SET username = ?, password = ?, registered = now()', [username, hashedPassword], (error, result) => {
          if (error) {
            console.log(error);
          }
          else {
            db.query('UPDATE invitecodes SET isValid = 0, usedBy = ?, usedDate = now() WHERE code = ?', [username, invitecode], (err, result) => {
              if (err) {
                console.log(err);
              } else {
                return res.render('auth/register', {
                  message: 'user registered'
                });
              }
            })
          };
        });
      } else {
        console.log(results[0].isValid);
        return res.render('auth/register', {
          message: 'invitecode is not valid anymore.'
        });
      };
    });

  });
}

exports.login = (req, res) => {
  username = req.body.username;
  db.query(
    'SELECT * FROM users WHERE username = ?', [username],
    (err, result) => {

      if (err) {
        throw err;
      };

      if (!result.length) {
        return res.status(400).send({
          message: 'username or password incorrect. 1'
        });
      };

      bcrypt.compare(req.body.password, result[0]['password'], (bErr, bResult) => {
        if (bErr) {
          throw bErr;
        };

        if (bResult) {

          // const token = jwt.sign({
          //   username: result[0].username,
          //   userId: result[0].id,
          // }, process.env.SECRETKEY, { expiresIn: '90d' });

          // return res.redirect('/', {
          //   message: 'logged in.',
          //   token,
          //   user: result[0],
          // });


          req.session.loggedin = true;
          req.session.username = username;
          res.redirect('/tools');

        } else {
          return res.render('auth/login', {
            message: 'username or password incorrect.'
          });
        }

        // return res.status(400).send({
        //   message: 'username or password incorrect.'
        // });

      });
    }
  );
};

exports.isAdmin = (req, res, next) => {
  if(req.session.loggedin) {
    var username = req.session.username;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if(err) {
          throw err;
        };

        if(!result.length) {
          return res.status(400).send({
            message: 'kein zutritt hier'
          });
        };

        var admincolumn = result[0].admin;

        if(admincolumn === 1) {
          return next();
        } else {
          return res.status(400).send({
            message: 'admins only'
          });
        };
    });
  } else {
    return res.redirect('/login');
  };
};
