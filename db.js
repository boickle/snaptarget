'use strict';

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('./config');
//const notificationHelper = require('./notificationHelper');

module.exports = function (uri) {

   // configure database for environments
   const env = process.env.NODE_ENV || 'production';
   let uriString;

   if (uri) {

      uriString = uri;

   } else if (env === 'production') {

      // production MongoLab configuration
      uriString = 'mongodb://snap:snap123@ds115583.mlab.com:15583/snaptarget';

      // 'production' sandbox Mongolab configuration
      //uriString = 'mongodb://dbuser:password@ds035385.mongolab.com:35385/wb';

   } else if (env === 'development') {

      // 'development' sandbox Mongolab configuration
      uriString = 'mongodb://snap:snap123@ds115583.mlab.com:15583/snaptarget';

   } else if (env === 'test') {

      // 'test' sandbox Mongolab configuration - mongodb://<dbuser>:<dbpassword>@ds023448.mlab.com:23448/wb-test
      uriString = 'mongodb://snap:snap123@ds115583.mlab.com:15583/snaptarget';

   }

   // CONNECTION EVENTS
   const appEnv = process.env.APP_ENV || null;

   // When successfully connected
   mongoose.connection.on('connected', function () {
      const message = 'Mongoose <' + appEnv + '> connection open to <' + uriString + '>';
      console.log(message);
      if (!_.isNull(appEnv)) {
         //notificationHelper.sendSlackNotification(config.slackServiceNotificationsUrl, message);
      }
   });

   // If the connection throws an error
   mongoose.connection.on('error', function (err) {
      const message = 'Mongoose <' + appEnv + '> connection error <' + err + '> to <' + uriString + '>';
      console.log(message);
      if (!_.isNull(appEnv)) {
         //notificationHelper.sendSlackNotification(config.slackServiceNotificationsUrl, message);
      }
   });

   // When the connection is disconnected
   mongoose.connection.on('disconnected', function () {
      const message = 'Mongoose <' + appEnv + '> connection disconnected <' + uriString + '>';
      console.log(message);
      if (!_.isNull(appEnv)) {
         //notificationHelper.sendSlackNotification(config.slackServiceNotificationsUrl, message);
      }
   });

   // If the Node process ends, close the Mongoose connection
   process.on('SIGINT', function () {
      mongoose.connection.close(function () {
         const message = 'Mongoose <' + appEnv + '> connection disconnected through app termination <' + uriString + '>';
         console.log(message);
         if (!_.isNull(appEnv)) {
            //notificationHelper.sendSlackNotification(config.slackServiceNotificationsUrl, message);
         }
         process.exit(0);
      });
   });

   const mongoOptions = {db: {safe: true}};

   // connect to database
   mongoose.connect(uriString, mongoOptions, function (err, res) {
      if (err) {
         console.log('ERROR connecting to: ' + uriString + ' (' + env + ')' + '. ' + err);
      } else {
         console.log('Successfully connected to: ' + uriString + ' (' + appEnv + ' - ' + env + ')');
      }
   });

   // bootstrap models
   const modelsPath = path.join(__dirname, 'models');
   fs.readdirSync(modelsPath).forEach(function (file) {
      require(modelsPath + '/' + file);
   });

   return mongoose;
};
