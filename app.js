const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv")
const session = require('express-session');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');

//for remote server
const fs = require('fs');
const http = require('http');
const https = require('https');
var privateKey = fs.readFileSync('ssl/privkey.pem', 'utf-8');        
var certificate = fs.readFileSync('ssl/cert.pem', 'utf-8');
var credentials = {key: privateKey, cert: certificate};
//end of remote server

dotenv.config({ path: './.env' });

const db = require('./middleware/database');

const app = express();

//dir used for frontend
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

app.use(session({
  secret: process.env.SECRETKEY,
  resave: true,
  saveUninitialized: true
}));

//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
//parse json bodies (as sent by API clients)
app.use(express.json());

//set the view-engine
hbs.registerPartials(__dirname + '/views/partials/');
app.set('view engine', 'hbs');

function genpw() {
    let hashedPassword = bcrypt.hash('asdf', 10);
    console.log(hashedPassword);
}

//connect to db
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  else {
      let hashpw = bcrypt.hashSync('asdf', 10);
      console.log(hashpw);
    console.log("mysql connected.");
  }
});

//routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));
app.use('/tools', require('./routes/tools'));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.listen(4500, () => {
  console.log("server started on port 5000");
});

httpServer.listen(5000);
httpsServer.listen(5443);
