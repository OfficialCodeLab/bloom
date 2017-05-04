import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }

		let id = this.get("session").get('currentUser').providerData[0]._uid;
        let user = this.store.peekRecord('user', id);
        //First tier auth
        if(!user.get('accountType')){
  			this.transitionTo('/404');
    	} else {
    		//Second tier auth
    	}

        return sesh;
    }
});
