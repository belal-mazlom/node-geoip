var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model(
	'aramexCountry',
	{	
		countryCode: 		{type: String, unique: true},

		originalNameEn: 	{type: String},
		originalNameAr:		{type: String},
		
		nameEn: 			{type: String},
		nameAr: 			{type: String},

		stateRequired: 	 	{type: Boolean},
		postcodeRequired: 	{type: Boolean},
		intlCallingNumber:  {type: String},

		popularity: {type: Number},

		suggestions: [{type: ObjectId, ref: 'Suggestion'}],
		
		timeCreated: Date,
		timeUpdated: Date,
		updatedBy: {type: ObjectId, ref: 'User'},

		checked: {type: Boolean, default: false},
		checkedBy: {type: ObjectId, ref: 'User'},

		flagDelete: {type: Boolean, default: false},
		flagDeleteBy: {type: ObjectId, ref: 'User'}
	},
	'countries'
);