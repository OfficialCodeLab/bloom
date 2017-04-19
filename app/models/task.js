import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({	
	title: attr('string'),
	desc: attr('string'),
	due: attr('string'),
	createdOn: attr('string'),
	createdBy: attr('string'),
	asssignedTo: hasMany('user'),
	completed: attr('boolean'),
  month: attr('number', {defaultValue: 1})
});
