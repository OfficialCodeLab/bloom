import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
	wedding: belongsTo('wedding', { inverse: 'budget', async: true }),
	total: attr('string'),
	used: attr('string'),
	moneyFromFam: attr('string'),
	savedSoFar: attr('string'),
	leftToSave: attr('string'),
	//Example structure:
	// {
	// 	 name: "Minister Services",
	//   category: "Venue",
	// 	 booked: "213",
	// 	 estimate: "4544",
	// 	 deposit: "123",
	// 	 balance: "4218"
	// }
	minister: attr(),
	dress: attr()
	//etc
});
