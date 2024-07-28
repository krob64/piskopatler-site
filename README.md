# what is this?
This was a personal site for me and my friends with the main goal of archiving absurdly insulting messages we received whilst playing counterstrike. We deemed them too hilarious to let them be lost over time.\
Later on i added a quake map randomizer due to us having trouble deciding which map we want to play.

Yes, node_modules isn't being gitignored. I haven't worked on this project for 2 years and i'm pretty sure all hell will break loose with a clean `$ npm install`.

Built using mysql, expressjs and handlebars templating with bootstrap 5.

# building & running
Setup the MySQL database\
```$ ./setup-db.sh```\
It'll also add a user and some filler data for the wall of shame.\
`USERNAME: testuser`\
`PASSWORD: asdf`

Copy `.env.example` to `.env` and fill it out. 

start the server\
```$ node app.js```
