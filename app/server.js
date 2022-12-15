const express = require('express');
const app = express();
const env = require('cfenv');

app.get('/runjob', function (req, res) {
    res.send('Job succesfully executed');
});

//Not working => const port = process.env.port || 3000;
const appenv = env.getAppEnv();
const port = appenv.port || 3000;
app.listen(port, function(){
    console.log('listening...');
});