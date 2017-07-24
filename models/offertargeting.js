'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('node-mongoose-validator');

const fields = {
    offerTargetName: {
       type: String,
       required: 'Offer name is required',
       index: true
    },
    offer: {
      type: Schema.Types.ObjectId,
      required: 'Offer is required',
      ref: 'Offer'
    },
    target: {
      type: Schema.Types.ObjectId,
      required: 'Target is required',
      ref: 'Target'
    },
   markedAsDeleted: {
      type: Boolean,
      default: false
   }
};

const schema = new Schema(fields, {timestamps: true});

module.exports = mongoose.model('OfferTargeting', schema);
