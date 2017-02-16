import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
	// wedding: belongsTo('wedding', { inverse: 'budget', async: true }),

	//Editable fields
	total: attr('string'),
	moneyFromFam: attr('string'),
	savedSoFar: attr('string'),

	//Calculated fields

	used: attr('string'),
	unallocated: attr('string'),
	categoryTotals: attr(),
	leftToSave: attr('string'),

	//Example structure (category totals):
	// {
	// 	 apparel: 123,
	//   people: 2134,
	// 	 event: 4152,
	// 	 palces: 2344,
	// 	 additional: 4124
	// }

	//Categories	
	
	categoryApparel: attr(),
	categoryPeople: attr(),
	categoryEvent: attr(),
	categoryPlaces: attr(),
	categoryAdditional: attr()

	//Example structure (category):
	// {
	// 	 name: "Minister Services",
	//   category: "Venue",
	// 	 booked: "213",
	// 	 estimate: "4544",
	// 	 deposit: "123",
	// 	 balance: "4218"
	// }

});
