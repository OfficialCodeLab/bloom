import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	captchaVerified: '',
	messageN: '',
    menuOpen: false,
    scrollPos1: 0,
    scrollPos2: 0,
    displayName: '',

    
	currentPathDidChange: function() {
    // path = this.get('currentPath');
    // console.log('path changed to: ', path);
    window.scrollTo(0,0);
  }.observes('currentPath'),
});
