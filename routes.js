'use strict';

const auth = require('./authentication');
const mongoose = require('mongoose');
const api = require('./api');
const offerController = require('./controllers/offer');
const offerModel = mongoose.models.Offer;
const targetController = require('./controllers/target');
const targetModel = mongoose.models.Target;
const offerTargetingController = require('./controllers/offertargeting');
const offerTargetingModel = mongoose.models.OfferTargeting;

const apiToolsController = require('./controllers/apiTools');


module.exports.setup = function (app) {

   const baseRoute = '/api';

   // Auth middleware protects all POST, PUT and DELETE routes
   // Hook up user login, user add/signup, and device routes before auth middleware

   // Default home route
   app.get('/', function (req, res) {
      res.send('snapServer v1.0.0');
   });

   app.get('/generatetoken', function (req, res) {
     apiToolsController.generateKey('1234', function(err, token){

       if(err){
         return res.status(401).send();
       } else{
         res.send(token);
       }

     });

   });

   auth.setTokenSecret(process.env.PARAM2 || 'SnapDev');
   app.get('/api/*', auth.middleware({requireAuth: true}));
   app.post('/api/*', auth.middleware({requireAuth: true}));
   app.put('/api/*', auth.middleware({requireAuth: true}));
   app.delete('/api/*', auth.middleware({requireAuth: true}));

   app.get(baseRoute + '/', function (req, res) {
      res.send('snapServer v1.0.0');
   });

   app.get(baseRoute + '/offers', function (req, res) {
      api.getAllBy({'markedAsDeleted': { $ne: true }}, {'createdAt': -1}, offerController, offerModel, req, res);
   });
   app.post(baseRoute + '/offers', function (req, res) {
      api.add(offerController, offerModel, req, res);
   });
  app.get(baseRoute + '/offers/:id', function (req, res) {
     api.getBy({'_id': req.params['id']}, offerController, offerModel, req, res);
  });

   app.get(baseRoute + '/targets', function (req, res) {
      api.getAllBy({'markedAsDeleted': { $ne: true }}, {'createdAt': -1}, targetController, targetModel, req, res);
   });
   app.post(baseRoute + '/targets', function (req, res) {
      api.add(targetController, targetModel, req, res);
   });
   app.get(baseRoute + '/targets/:id', function (req, res) {
      api.getBy({'_id': req.params['id']}, targetController, targetModel, req, res);
   });

   app.get(baseRoute + '/offertargeting', function (req, res) {
      api.getAllBy({'markedAsDeleted': { $ne: true }}, {'createdAt': -1}, offerTargetingController, offerTargetingModel, req, res);
   });
   app.post(baseRoute + '/offertargeting', function (req, res) {
      api.add(offerTargetingController, offerTargetingModel, req, res);
   });
   app.get(baseRoute + '/offertargeting/:id', function (req, res) {
      api.getBy({'_id': req.params['id']}, offerTargetingController, offerTargetingModel, req, res);
   });


   /// catch 404
   app.use(function (req, res, next) {
      res.status(404).send('404 Not Found');
   });

   // fall thru to 500
   app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send('500 Internal Server Error');
   });

};
