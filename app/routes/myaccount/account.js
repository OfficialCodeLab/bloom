import Ember from 'ember';

export default Ember.Route.extend({
    model () {
		let _id = this.get("currentUser.uid") + "";
		return Ember.RSVP.hash({
	      user: this.store.peekRecord('user', _id)
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    // var sesh = this.get("session").fetch().catch(function() {});
	    Ember.set(controller, 'user', model.user);
	    try {
		    let birthday = model.user.get('birthday');
		  	controller.set('birthday', birthday);	    	
	    } catch (ex) {}

	    try {	    	
		    if(this.get("session").get('currentUser').providerData[0].providerId === "password") {
		    	controller.set('isPasswordAccount', true);
		    }
	    } catch (ex) {}
	  },
	  actions: {
		dateChanged: function (date, valid){
			if(valid){              
				this.controller.set('birthday', date);
				let _id = this.get("currentUser.uid") + "";
				let user = this.store.peekRecord('user', _id);
				user.set('birthday', date);
				// this.dateDiff(this.controller.get('computedSelected'), this.controller.get('dateCurrent'));	
				// wedding.save();
			}
		}
	  }
});
