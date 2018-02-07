import Ember from 'ember';

export default Ember.Controller.extend({

	profileImgUrl : '',
	notifications: Ember.inject.service('notification-messages'),
	// accountType: this.get('model').get('accountType'),
	// isVendorReqBtn: Ember.computed.equal('accountType', 'user')
});
