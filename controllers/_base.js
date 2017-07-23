'use strict';

const _ = require('lodash');
const controller = {};

// Common callback
const cbf = function (cb, err, document) {

   if (cb && typeof(cb) === 'function') {
      if (err) cb(err);
      else cb(false, document);
   }
};

controller.cbf = cbf;

// GET
controller.getBy = function (query, Model, cb) {

   //console.log('controller.getBy query <' + JSON.stringify(query) + '>');

   Model
      .findOne(query)
      .exec(function (err, document) {
         cbf(cb, err, document);
      });
};

controller.getAll = function (orderBy, Model, cb) {

   Model
      .find()
      .sort(orderBy)
      .exec(function (err, documents) {
         cbf(cb, err, documents);
      });
};

// GET
controller.getAllBy = function (query, orderBy, Model, cb) {

   //console.log('controller.getAllBy query <' + query + '> orderBy <' + orderBy + '>');

   Model
      .find(query)
      .sort(orderBy)
      .exec(function (err, documents) {
         cbf(cb, err, documents);
      });
};

// POST
controller.add = function (document, Model, cb) {

   document = new Model(document);
   document.save(function (err) {
      cbf(cb, err, document);
   });
};

controller.addMany = function (documents, Model, cb) {

   Model.create(documents, function (err, documents) {
      cbf(cb, err, documents);
   });
};

// PUT
controller.updateBy = function (query, updateData, Model, cb) {

   //console.log('controller.updateBy query <' + query + '>');

   Model.findOne(query, function (err, document) {
      //console.log('document <' + document + '> err <' + err + '>');
      if (err || _.isEmpty(document)) {
         cbf(cb, err, document);
      } else {
         Model.schema.eachPath(function (path) {
            //console.log('path <' + path + '>');
            if (typeof updateData[path] !== 'undefined') {
               //console.log('updating path <' + path + '>');
               document[path] = updateData[path];
            }
         });

         return document.save(function (err) {
            cbf(cb, err, document);
         });
      }
   });
};

// TODO - updateMany

// DELETE
controller.deleteBy = function (query, Model, cb) {

   //console.log('controller.deleteBy query <' + query + '>');

   return Model.remove(query, function (err) {
      cbf(cb, err, null);
   });
};

module.exports = controller;
