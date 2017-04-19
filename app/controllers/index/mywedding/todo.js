import Ember from 'ember';

export default Ember.Controller.extend({
	viewAll: true,
	notifications: Ember.inject.service('notification-messages'),
  monthArr: [],
  refresh: true
});
