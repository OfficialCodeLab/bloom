import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({	
	title: attr('string'),
	desc: attr('string'),
	due: attr('date'),
	createdOn: attr('date'),
	createdBy: belongsTo('user'),
	asssignedTo: hasMany('user'),
	completed: attr('boolean')
});
