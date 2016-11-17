import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
	budgetT: attr('string'),
	budgetU: attr('string')
});
