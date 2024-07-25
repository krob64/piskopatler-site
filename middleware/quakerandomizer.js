const { format } = require('./database');
const db = require('./database');


let quake_maps = [
    'aerowalk', 'battleforged', 'blood run', 'campgrounds', 'cure',
    'delirium', 'dismemberment', 'furious heights', 'hektik',
    'house of decay', 'lost world', 'phrantic', 'silence', 'sinister',
    'toxicity', 'use and abuse'
];

getRandomInt = (min, max, callback) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; 
    callback(randomNumber);
};

exports.rollRandomMap = (req, res) => {
  if(req.session.loggedin) {
      var username = req.session.username;
      getRandomInt(0, quake_maps.length, (number) => {
          rolledMap = quake_maps[number];
          db.query('INSERT INTO quakerolls SET username = ?, map_name = ?, rollDate = now()', [username, rolledMap], (err, result) => {
              if(err) {
                  return console.log(err);
              };
              return res.redirect('/tools/quakerandomizer');
          });
      });
  } 
};

exports.getMapList = (req, res, callback) => {
    if(req.session.loggedin) {
        var mapList = [];
        db.query(`SELECT * FROM quakerolls ORDER BY id DESC;`, (err, rows, fields) => {
            
            if (err) {
            console.log(err)
            res.status(500).send({
                message: 'internal server error'
            });
            } else {
                const dateformatter = Intl.DateTimeFormat('de-DE',{
                    year: "numeric",
                    month: '2-digit',
                    day: "2-digit",
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });                

                for (let i = 0; i < rows.length; i++) {
                    const formattedRollDate = dateformatter.format(rows[i].rollDate);
                    var roll = {
                    'id': rows[i].id,
                    'map': rows[i].map_name,
                    'username': rows[i].username,
                    'rollDate': formattedRollDate
                    };
                    mapList.push(roll);
                };
                callback(mapList);
                };
        });
    }
};


