import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	isSelected0: true,
	isSelected1: false,
	isSelected2: false
});
