const express = require('express');
const env = require('cfenv');
const xsenv = require('@sap/xsenv');
const { Passport } = require('passport');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

//making a passport Configuration
const xsuaaService = xsenv.getServices({myPassportXsuaa: {tag: 'xsuaa'}});
const xsuaaCreds = xsuaaService.myPassportXsuaa;
const strategy = new JWTStrategy(xsuaaCreds);
const passport = new Passport();
passport.use(strategy);

//configuring of express server with authorization middleware
const app = express();

// Middleware to read JWT sent by JobScheduler
function jwtLogger(req, res, next) {
    console.log('===> [JWT-LOGGER]  decoding auth header' )
    let authHeader = req.headers.authorization;
    if (authHeader){
       var theJwtToken = authHeader.substring(7);
       if(theJwtToken){
          let jwtBase64Encoded = theJwtToken.split('.')[1];
          if(jwtBase64Encoded){
             let jwtDecoded = Buffer.from(jwtBase64Encoded, 'base64').toString('ascii');
             let jwtDecodedJson = JSON.parse(jwtDecoded);
             console.log('===> [JWT-LOGGER]: JWT contains scopes: ' + jwtDecodedJson.scope);
             console.log('===> [JWT-LOGGER]: JWT contains client_id sent by Jobscheduler: ' + jwtDecodedJson.client_id);
          }
       }
    }
    next();
 }
app.use(jwtLogger);

app.use(passport.initialize());
app.use(passport.authenticate('JWT', {session: false}));

// create server endpoint for testing purposes
app.get('/runjob', function (req, res) {
    res.send('Job succesfully executed');
});

//create a port and let the server listen to that port
// What they wrote about the ports in the tutorial was not working, the only way to set them dynamically is this way
const appenv = env.getAppEnv();
const port = appenv.port || 3000;
console.log(port);
app.listen(port, function(){
    console.log('listening...');
});