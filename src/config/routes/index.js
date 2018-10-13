const express = require('express');
const router = express.Router();
const authRouter = require('../../resources/auth');
const todoRouter = require('../../resources/todo');
const userRouter = require('../../resources/user');
const notFound = require('./404');

module.exports = function (app) {

  // add the API modules
  router.use('/auth', authRouter);
  router.use('/todo', todoRouter);
  router.use('/user', userRouter);

  app.use(router);
  app.use(notFound);
};