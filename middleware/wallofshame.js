const db = require('./database');
const SteamAPI = require('steamapi');

const steam = new SteamAPI(process.env.STEAMAPI_KEY);

function convertSteamLink(steamlink, callback) {
  steam.resolve(steamlink).then(id => {
    console.log('raw s64-id: ' + id);
    var permlink = 'https://steamcommunity.com/profiles/' + id;
    console.log('permlink:' + permlink);

    callback(permlink);
  });
};

exports.getEntries = (req, res, callback) => {
  var messageList = [];
  db.query(`SELECT * FROM wallofshame ORDER BY id DESC;`, (err, rows, fields) => {
    if (err) {
      res.status(500).send({
        message: 'internal server error'
      });
    } else {
      for (let i = 0; i < rows.length; i++) {
        var message = {
          'name': rows[i].name,
          'steamlink': rows[i].steamlink,
          'message': rows[i].message,
          'date': rows[i].date.getDate() + '.' + (rows[i].date.getMonth() + 1) + '.' + rows[i].date.getFullYear(),
        }

        messageList.push(message);
      };

      callback(messageList);
    };
  });
}

exports.addEntry = (req, res) => {
  const messageGet = req.body.message;
  const message = messageGet.split(':')[1];
  const steamlink = req.body.steamlink;
  const name = messageGet.split(':')[0];
  var permlink = '';
  name + ':';

  db.query("SELECT message FROM wallofshame WHERE message = ?", [message], (error, result) => {
    if (error) {
      throw error;
    };

    if (result.length > 0) {
      return res.render('wallofshame', {
        message: 'msg already exists'
      })
    } else if (steamlink.startsWith('https://steamcommunity.com/profiles/') || steamlink.startsWith('https://steamcommunity.com/id/')) {
      convertSteamLink(steamlink, (retlink) => {
        permlink = retlink;

        db.query('INSERT INTO wallofshame SET name = ?, message = ?, steamlink = ?, date = now()', [name, message, permlink], (error, result) => {
          if (error) {
            throw error;
          } else {
            res.redirect('/easteuros');
          };
        });
      });

    } else {
      return res.render('wallofshame', {
        message: 'invalid input.'
      });
    };

  });
};

