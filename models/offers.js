'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('node-mongoose-validator');

const fields = {
   offerName: {
      type: String,
      required: 'Offer name is required',
      index: true
   },
   creativeUrl: {
      required: 'required',
      type: String
   },
   clickUrl: {
      required: 'required',
      type: String
   },
   trackingUrl: {
      required: 'required',
      type: String
   },
   markedAsDeleted: {
      type: Boolean,
      default: false
   }
};

const schema = new Schema(fields, {timestamps: true});

module.exports = mongoose.model('Offer', schema);
