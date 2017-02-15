import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
	// wedding: belongsTo('wedding', { inverse: 'budget', async: true }),
	total: attr('string'),
	used: attr('string'),
	moneyFromFam: attr('string'),
	savedSoFar: attr('string'),
	leftToSave: attr('string'),

	//Categories	

	//Example structure:
	// {
	// 	 name: "Minister Services",
	//   category: "Venue",
	// 	 booked: "213",
	// 	 estimate: "4544",
	// 	 deposit: "123",
	// 	 balance: "4218"
	// }

	categoryApparel: attr(),
	categoryPeople: attr(),
	categoryEvent: attr(),
	categoryPlaces: attr(),
	categoryAdditional: attr()

	// //Apparel:
	// weddingDress: attr(),
	// groomSuit: attr(),
	// hairAndMakeup: attr(),
	// bridesmaidDresses: attr(),
	// groomsmenSuits: attr(),
	// weddingRings: attr(),
	// shoesAndAccessories: attr(),

	// //People:
	// photographer: attr(),
	// videographer: attr(),
	// officiant: attr(),
	// bandOrDJ: attr(),
	// florist: attr(),

	// //Event:
	// foodAndDrinks: attr(),
	// decor: attr(),
	// cake: attr(),
	// weddingFavours: attr(),
	// bridalPartyGifts: attr(),
	// addedExtras: attr(),

	// //Places
	// venue: attr(),
	// weddingNightHotel: attr(),
	// accomodationForBridalParty: attr(),

	// //Additional
	// weddingStationery: attr(),
	// photobooth: attr(),
	// honeymoon: attr(),
	// insurance: attr()
});
