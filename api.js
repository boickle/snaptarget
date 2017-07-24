'use strict';

const statusHandler = require('./statusHandler');
const api = {};

// POST
api.add = function (controller, model, req, res) {

   const dataKey = Object.keys(req.body);
   //console.log('api.add dataKey <' + dataKey + '>');

   controller.add(req.body[dataKey], model, function (err, data) {
      statusHandler(err, res, data);
   });
};

// GET
api.getBy = function (query, controller, model, req, res) {

   //console.log('api.getBy query <' + JSON.stringify(query) + '>');

   controller.getBy(query, model, function (err, data) {
      statusHandler(err, res, data);
   });
};

api.getAll = function (orderBy, controller, model, req, res) {

   controller.getAll(orderBy, model, function (err, data) {
      statusHandler(err, res, data);
   });
};

// GET
api.getAllBy = function (query, orderBy, controller, model, req, res) {

   controller.getAllBy(query, orderBy, model, function (err, data) {
      statusHandler(err, res, data);
   });
};

// PUT
api.updateBy = function (query, controller, model, req, res) {

   const dataKey = Object.keys(req.body);
   //console.log('api.updateBy dataKey <' + dataKey + '>');
   //console.log('request.body <' + JSON.stringify(req.body) + '>');

   return controller.updateBy(query, req.body[dataKey], model, function (err, data) {
      statusHandler(err, res, data);
   });
};

// DELETE
api.deleteBy = function (query, controller, model, req, res) {

   return controller.deleteBy(query, model, function (err, data) {
      statusHandler(err, res, data, 200, true);
   });
};

module.exports = api;
