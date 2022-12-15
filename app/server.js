const express = require('express');
const app = express();

app.get('/runjob', function (req, res) {
    res.send('Job succesfully executed');
});

const port = process.env.port || 3000;
app.listen(port, function(){
    console.log('listening...');
});