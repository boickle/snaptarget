'use strict';
const extend = require('extend');
const controller = {};
const baseController = require('./_base.js');
const statusHandler = require('../statusHandler');
const mongoose = require('mongoose');

const GENDER = 'gender';
const LOCATION = 'location';
const AGE = 'age';
const KEYWORD = 'keyword';

extend(controller, baseController);

module.exports = controller;



controller.getBestOffer = function (req, res) {
  const targetModel = mongoose.models.Target;
  const offerModel = mongoose.models.Offer;
  const offerTargetModel = mongoose.models.OfferTargeting;

   let gender = req.query.gender;
   let age = req.query.age;
   let keywords = req.query.keywords;
   let location = req.query.location;
   let err = null;

   let genderQuery = {targetName: GENDER, targetValue: gender};
   let ageQuery = {targetName: AGE, targetValuetargetValue: {$eq: age}};

   let offers = [];
   handleGender(gender, [], function(err, genderOffers){
      if(gender){
        offers = genderOffers;
      }
      handleAge(age, offers, function(err, ageOffers){
        if(age){
          offers=ageOffers;
        }
          handleKeywords(age, offers, function(err, keywordOffers){
          if(keywords){
            offers=keywordOffers;
          }

          getOffers(offers, function(err, documents){
            statusHandler(err, res, documents);
          });
        });
      });
    });

};

function handleGender(gender, includeOffers, cb){
  if(!gender){
    return cb(err, includeOffers);
  }

  const offerTargetModel = mongoose.models.OfferTargeting;
  let query = '{markedAsDeleted: false}';
  if(includeOffers.length!=0){
    query={'offer': { $in: includeOffers}, markedAsDeleted: false};
  }
  offerTargetModel
     .find(query)
     .populate({
       path: `target`,
       match: {
         targetName: {$eq: GENDER}, targetValue: {$eq: gender}}
     })
     .exec(function (err, documents) {
        var offers = [];
        if(err) { return cb(err, []); }

        documents.forEach(function(document) {
          if(document.target){
            offers.push(document.offer);
          }

        });
        if(offers.length==0){
          offers = includeOffers;  //no age targeting available for these offers.
        }

        return cb(err, offers);
     });
}

function handleAge(age, includeOffers, cb){
  if(!age){
    return cb(err, includeOffers);
  }
  let query = '{markedAsDeleted: false}';
  if(includeOffers.length!=0){
    query={'offer': { $in: includeOffers}, markedAsDeleted: false};
  }
  const offerTargetModel = mongoose.models.OfferTargeting;
  console.log(includeOffers);
  offerTargetModel
     .find(query)
     .populate({
       path: `target`,
       match: {targetName: {$eq: AGE}}
     })
     .exec(function (err, documents) {
        var offers = [];

        documents.forEach(function(document) {
          if(document.target){
            if(checkAgeLogic(age, document)){
              offers.push(document.offer);
            }
          }
        });

        if(offers.length==0){
          offers = includeOffers;  //no age targeting available for these offers.
        }
        return cb(err, offers);
     });
}

function handleKeywords(keywords, includeOffers, cb){
  if(!keywords){
    return cb(err, includeOffers);
  }
  let query = '{markedAsDeleted: false}';
  if(includeOffers.length!=0){
    query={'offer': { $in: includeOffers}, markedAsDeleted: false};
  }
  const offerTargetModel = mongoose.models.OfferTargeting;
  console.log(includeOffers);
  offerTargetModel
     .find(query)
     .populate({
       path: `target`,
       match: {targetName: {$eq: KEYWORD}, targetValue: {$in: keywords}}
     })
     .exec(function (err, documents) {
        var offers = [];

        documents.forEach(function(document) {
          if(document.target){
              offers.push(document.offer);
          }
        });

        if(offers.length==0){
          offers = includeOffers;  //no age targeting available for these offers.
        }
        return cb(err, offers);
     });
}

function getOffers(offers, cb){
  const offerModel = mongoose.models.Offer;
  offerModel
     .find({'_id': { $in: offers}})
     .exec(function (err, documents) {
       return cb(err, documents);
     });
}

function checkAgeLogic(age, ageTarget){
  const GREATER_THAN = 'greater than';
  const LESS_THAN = 'less than';
  const EQUAL = 'equal';

  if(ageTarget.target.targetType.toString() === GREATER_THAN){
    console.log(age);
    console.log(ageTarget);
    if(age > ageTarget.target.targetValue){
      return true;
    }
  } else if (ageTarget.target.targetType === LESS_THAN){
    if(age < ageTarget.target.targetValue) {
      return true;
    }
  } else if (ageTarget.traget.targetType == EQUAL){
    if(age == ageTarget.target.targetValue) {
      return true;
    }
  } else {
    return false;
  }

}


module.exports = controller;
