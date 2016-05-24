import Ember from 'ember';

export default Ember.Route.extend({

	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }

      	  let _id = this.get("session").content.currentUser.id + "";
          let user = this.store.peekRecord('user', _id);
          if(!user.get('vendorAccount')){
          	this.transitionTo('index.vendor.login');
          }
          return sesh;
    },
    model(){    	
	    let _id = this.get("session").content.currentUser.id + "";
		let user = this.store.peekRecord('user', _id);
    	return this.store.findRecord('vendor', user.get('vendorAccount'));
    },
    actions: {
    	saveChanges(model) {
    		model.save();
    	}
    }
});
