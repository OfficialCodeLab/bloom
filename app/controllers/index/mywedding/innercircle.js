import Ember from 'ember';

export default Ember.Controller.extend({
	name: '',
	searching: '',
	responseMessage: '',
	searchResults: Ember.A([]),
	scroller: Ember.inject.service()
});
