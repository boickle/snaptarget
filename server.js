'use strict';

const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');

module.exports = function () {

   const app = express();
   app.disable('x-powered-by');

   app.use(cors());

   app.locals.siteName = 'Snap Targetting Engine';

   const env = process.env.NODE_ENV || 'development';

   // configure morgan/errorHandler for environments
   if (env === 'development') {
      app.use(morgan('dev'));
      app.use(errorhandler({
         dumpExceptions: true,
         showStack: true
      }));
      app.set('view options', {
         pretty: true
      });
   }

   if (env === 'test') {
      app.use(morgan('test'));
      app.use(errorhandler({
         dumpExceptions: true,
         showStack: true
      }));
      app.set('view options', {
         pretty: true
      });
   }

   if (env === 'production') {
      app.use(morgan('combined'));
      app.use(errorhandler({
         dumpExceptions: false,
         showStack: false
      }));
   }

   app.use(methodOverride());
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({extended: true}));

   // hook up routes
   const routes = require('./routes').setup(app);

   // start server
   const port = process.env.PORT || 3000;
   if (env !== 'test') {
      const server = app.listen(port, function () {
         console.log('snapServer listening at port %s in %s mode', port, app.get('env'));
         if (env !== 'production') {
            console.log('\nprocess.env ', process.env);
         }
      });
   }

   return app;
};
