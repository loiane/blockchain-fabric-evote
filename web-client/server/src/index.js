'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

app.get('/', (req, res) => {
    res.send('Hello!\n');
});

app.listen(port, () => console.log(`API running on port ${port}`));