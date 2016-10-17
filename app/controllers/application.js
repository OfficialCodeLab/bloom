import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
    menuOpen: false,
    scrollPos1: 0,
    scrollPos2: 0,
    displayName: ''
});
