'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;

const routes = require('./routes');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(port, () => console.log(`API running on port ${port}`));