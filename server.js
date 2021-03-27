//server.js
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const port = process.env.PORT || 3003;
const app = express();
const cors = require('cors');
const compression = require('compression');
app.use(favicon(__dirname + '/public/favicon.png'));
// app.use(express.static(__dirname));
app.use(cors());
app.use(compression());
app.use(express.static(__dirname + '/build'));
app.get('*', (req, res) => res.sendFile(path.normalize(__dirname + '/build/index.html')));

app.listen(port,() => console.log(`listening to ${port}`));
