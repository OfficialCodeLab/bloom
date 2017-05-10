import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	onlyUsers: false,
	displayType: Ember.computed('onlyUsers', function(){
        if (this.get('onlyUsers')) {
            return "Only displaying users";
        } else {
            return "Displaying users & vendors";
        }
    })
});