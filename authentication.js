'use strict';

// Middleware which allows us to authenticate requests
const jwt = require('jwt-simple');
let jwtTokenSecret;

module.exports.setTokenSecret = function (secret) {

   jwtTokenSecret = secret;
   module.exports.tokenSecret = jwtTokenSecret;
};

module.exports.middleware = function (options) {

   return function (req, res, next) {
      // Client can pass a token in 3 ways
      // 1. Query string parameter
      // 2. Form body parameter
      // 3. HTTP header (called 'x-access-token')

      const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
      if (token) {
         try {
            const decoded = jwt.decode(token, jwtTokenSecret);

            // handle token here
            if (decoded.exp <= Date.now()) {
               // TODO - implement common error handling
               return res.status(401).json({
                  operationStatus: {errorCode: 100, errorDescription: 'Access token has expired'}
               });
            }

            // Attach user ID to login
            req.currentUserId = decoded.iss;

            // Successful authentication
            next();
         } catch (err) {

            console.log('We could not decode the login token, ERROR: <' + err + '>');

            return res.status(500).end();
         }
      } else {
         if (options.requireAuth) {
            // Auth is required, so return a 401
            return res.status(401).end();
         } else {
            // Auth isn't required, so just go to next controller
            next();
         }
      }
   };
};
