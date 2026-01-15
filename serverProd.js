'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const log = require('npmlog');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const roleRouter = require('./server/routes/roleRoutes');
const userRouter = require('./server/routes/userRoutes');
const documentRouter = require('./server/routes/documentRoutes');
const searchRouter = require('./server/routes/searchRoutes');

const app = express();

// 🔹 Swagger
const pathurl = path.join(__dirname, '/server/routes/*.js');

const swaggerDefinition = {
  info: {
    title: 'DocumentIT API Endpoints',
    version: '1.0.0',
    description: 'Describing the API Endpoints with Swagger',
  },
  host: 'localhost:7000',
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: [pathurl],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 🔹 PORT
const port = process.env.PORT || 10000;

// 🔹 Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'client/dist')));

// 🔹 Routes
app.use('/api/roles', roleRouter);
app.use('/api/users', userRouter);
app.use('/api/documents', documentRouter);
app.use('/api/search', searchRouter);

app.get('*', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Document Management System API',
  });
});

// 🔹 Start Server
app.listen(port, () => {
  log.info('express app started on port', `${port}`);
});

module.exports = app;
