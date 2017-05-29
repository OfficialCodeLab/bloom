import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	showVendors: true,
	showUsers: true,
	hideVendors: false,
	displayType: Ember.computed('hideVendors', function(){
        if (this.get('hideVendors')) {
            return "Only displaying users";
        } else {
            return "Displaying users & vendors";
        }
    })
});
