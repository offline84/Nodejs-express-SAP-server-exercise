const express = require('express');
const env = require('cfenv');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

//making a passport Configuration
const xsuaaService = xsenv.getServices({myPassportXsuaa: {tag: 'xsuaa'}});
const xsuaaCreds = xsuaaService.myPassportXsuaa;
const strategy = new JWTStrategy(xsuaaCreds);
passport.use(strategy);

//configuring of express server with authorization middleware
const app = express();
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