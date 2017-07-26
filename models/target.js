'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('node-mongoose-validator');

const fields = {
   targetName: {
      type: String,
      required: 'Offer name is required',
      index: true
   },
   targetValue: {
      required: 'required',
      type: String
   },
   targetWeight: {
      required: 'required',
      type: String
   },
   targetType: {
      type: String
   },
   markedAsDeleted: {
      type: Boolean,
      default: false
   }
};

const schema = new Schema(fields, {timestamps: true});

module.exports = mongoose.model('Target', schema);
