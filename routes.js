'use strict';

const auth = require('./authentication');
const mongoose = require('mongoose');
//const api = require('./api');
const offerController = require('./controllers/offers');
const offerModel = mongoose.models.Offers;


module.exports.setup = function (app) {

   const baseRoute = '/api/v1';

   // Auth middleware protects all POST, PUT and DELETE routes
   // Hook up user login, user add/signup, and device routes before auth middleware

   // Default home route
   app.get('/', function (req, res) {
      res.send('snapServer v1.0.0');
   });

   app.get('/api/*', auth.middleware({requireAuth: true}));
   app.post('/api/*', auth.middleware({requireAuth: true}));
   app.put('/api/*', auth.middleware({requireAuth: true}));
   app.delete('/api/*', auth.middleware({requireAuth: true}));


   app.get(baseRoute + '/offers', function (req, res) {
      api.getAllBy({'markedAsDeleted': { $ne: true }}, offerController, offerModel, req, res);
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
