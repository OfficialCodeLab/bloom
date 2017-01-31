
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
	countryCode: attr('string'),
	countryFull: attr('string'),
	provinces: hasMany('province')
});