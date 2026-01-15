'use strict';

const express = require('express');
const Router = express.Router();

const userController = require('../controllers/userController');
const documentController = require('../controllers/documentController');
const authentication = require('../middlewares/authentication');

Router.get('/users', authentication, userController.getUsers);
Router.get('/documents', authentication, documentController.getDocuments);

module.exports = Router;
