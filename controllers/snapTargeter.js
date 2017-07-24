'use strict';

const projectController = require('../controllers/project');
const projectModel = require('../models/project');
const forecastController = require('../controllers/forecast');
const forecastModel = require('../models/forecast');
const eventController = require('../controllers/event');
const eventModel = require('../models/event');
const activityController = require('../controllers/activity');
const activityModel = require('../models/activity');
const impactedActivityController = require('../controllers/impactedActivity');
const impactedActivityModel = require('../models/impactedActivity');
const statusHandler = require('../statusHandler');
const baseController = require('./_base.js');
const moment = require('moment');
const extend = require('extend');
const _ = require('lodash');

const controller = {};

extend(controller, baseController);

module.exports = controller;



controller.getBestOffer = function (req, res) {

   let gender = req.params.gender;
   let latitude = req.params.latitude;
   let latitude = req.params.longitude;
   let age = req.params.age;
   let keywords = req.params.keywords;

   let query = {project: projectId, type: type};

   Model
      .find(query)
      .sort({'createdAt': -1})
      .populate('project user forecast events impactedActivities', '-password -secret')
      .deepPopulate('project.group impactedActivities.activity')
      .limit(batchSize)
      .skip(skip)
      .exec(function (err, documents) {
         // we want outlook reports to be sorted by startDate (earliest first)
         // other reports are only sorted by createdAt
         if (parseInt(type) === 2) {
            //console.log('sorting');
            documents.sort(function (a, b) {
               return a.startDate > b.startDate;
            });
         }
         //console.log('documents <' + documents + '> err <' + err + '>');
         statusHandler(err, res, documents);
      });
};


module.exports = controller;
