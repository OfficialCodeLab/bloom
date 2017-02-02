import Ember from 'ember';
import format from 'ember-moment/computeds/format';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	captchaVerified: '',
	messageN: '',
    menuOpen: false,
    scrollPos1: 0,
    scrollPos2: 0,
    displayName: '',
    taskCurrent: '',
	dateCurrent: format(),

    
	currentPathDidChange: function() {
    // path = this.get('currentPath');
    // console.log('path changed to: ', path);
    window.scrollTo(0,0);
  }.observes('currentPath'),
});
