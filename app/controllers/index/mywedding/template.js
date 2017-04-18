import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),	
	name1: "John",
	name2: "Jane",
	subheading: "Would like to invite you, along with their families, to celebrate our love with us on our wedding day.",
	date: "Friday 23 October 2017 - 8pm",
	addressL1: "The Forest Walk",
	addressL2: "48 Allan Rd, Johannesburg, 1685",
	info1: "Dress is semi-formal",
	info2: "Cash bar available.",
	info3: "Please RSVP before 3 January 2017",
	contact: "086 123 1790"
});
