'use strict';

const _ = require('lodash');

// TODO: this needs refactoring/reimplementation

/**
 * @param {Object} err - Mongoose error object
 * @param {Object} res  - Express response object
 * @param {Object} data  - json body
 * @param {number} status  - status to override 200
 * @param {boolean} canBeEmpty - returns success even the data is empty, useful with collections
 */

module.exports = function (err, res, data, status, canBeEmpty) {
   canBeEmpty = canBeEmpty || false;
   if (err) {
      return handleErrors(res, err);
   }
   handleResults(res, data, status, canBeEmpty);
};

function handleErrors(res, err) {

   //console.log('handleErrors err.code <' + err.code + '> err.message <' + err.message + '> err.name <' + err.name + '> err.type <' + err.type + '> err.path <' + err.path + '>');

   // TODO: err.toString() isn't always valid JSON
   switch (err.name) {

   case 'ValidationError':
      res.status(200).json({
         operationStatus: {errorCode: 200, errorDescription: err.toString()}
      });
      break;

   case 'CastError':
      // invalid id
      if (err.type === undefined && err.path === '_id') {
         res.status(200).json({
            operationStatus: {errorCode: 201, errorDescription: err.name + ' - Invalid _id'}
         });
      }
      // TODO: not a CastError?
      else if (err.type === 'ObjectId' && err.path === '_id') {
         res.status(200).json({
            operationStatus: {errorCode: 202, errorDescription: err.toString()}
         });
      }
      else {
         res.status(200).json({
            operationStatus: {errorCode: 203, errorDescription: err.toString()}
         });
      }
      break;

   case 'MongoError':
      res.status(200).json({
         operationStatus: {errorCode: 300, errorDescription: 'MongoError: ' + err.message}
      });
      break;

   case 'RequestError':
   case 'ParameterError':
      res.status(200).json({
         operationStatus: {errorCode: err.code, errorDescription: err.message}
      });
      break;

   default:
      if (!_.isObject(err)) {
         res.sendStatus(500);
      }
      else {
         //If we manually set an error code use that instead of 400 as default
         if(!err.code) {
            res.status(200).json({
               operationStatus: {errorCode: 400, errorDescription: err.toString()}
            });
         }else{
            res.status(200).json({
               operationStatus: {errorCode: err.code, errorDescription: err.toString()}
            });
         }
      }
      break;
   }
}

function handleResults(res, data, status, canBeEmpty) {

   //console.log('handleResults <' + status + '> data <' + data + '> canBeEmpty <' + canBeEmpty + '> isEmpty <' + isEmpty(data) + '>');

   status = status || 200;

   if (_.isEmpty(data) && !canBeEmpty) {
      return res.status(status).json({
         operationStatus: {errorCode: -1, errorDescription: 'No objects found'}
      });
   }

   res.status(status).json({
      operationStatus: {errorCode: 0, errorDescription: 'Success'},
      data: data
   });
}
