import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({	
	title: attr('string'),
	desc: attr('string'),
	asssignedTo: hasMany('user'),
	completed: attr('boolean')
});
