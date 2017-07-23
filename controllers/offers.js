'use strict';

const extend = require('extend');
const baseController = require('./_base.js');
const controller = {};

extend(controller, baseController);

// GET
controller.getBy = function (query, Model, cb) {

   Model
      .findOne(query)
      .populate('user', '-password -secret')
      .exec(function (err, document) {
      baseController.cbf(cb, err, document);
   });
};

module.exports = controller;
