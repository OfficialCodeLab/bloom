import Ember from 'ember';

export default Ember.Controller.extend({
	name: '',
	searching: '',
	responseMessage: '',
	searchPartial: '',
	notifications: Ember.inject.service('notification-messages'),
	searchResults: Ember.A([]),
	scroller: Ember.inject.service()
});
