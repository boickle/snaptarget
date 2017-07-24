'use strict';

const extend = require('extend');
const baseController = require('./_base.js');
const auth = require('../authentication');
const moment = require('moment');
const jwt = require('jwt-simple');
const controller = {};

extend(controller, baseController);

controller.generateKey = function (id, cb) {
   const expires = moment().add(30, 'days').valueOf();   //the number of milliseconds since the Unix Epoch
   const token = jwt.encode({
      iss: id,
      exp: expires
   }, auth.tokenSecret);
   return cb(null, token);
};

module.exports = controller;
