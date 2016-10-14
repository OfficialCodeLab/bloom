import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function(transition) {
	    var sesh = this.get("session").fetch().catch(function() {});
	    if(!this.get('session.isAuthenticated')){
	        // transition.abort();
	        // Default back to homepage
	        this.transitionTo('login');
	    } 
	    return sesh;
  	},

  	//
	model () {
		//Before creating the record, clear the DS Store
		this.store.unloadAll('userext');
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		let providerID = this.get("session").get('currentUser').providerData[0].providerId + "";
		let imgStr;
		if(providerID === "facebook.com"){
			imgStr = "http://graph.facebook.com/" + _id + "/picture?type=large";
		} else {
			let imgStrSM = this.get("session").get('currentUser').providerData[0].photoURL;
			imgStr = imgStrSM.substring(0, imgStrSM.length-11) + imgStrSM.substring(imgStrSM.length-4, imgStrSM.length);
			//console.log("Image String: " + imgStrSM);
		}
		return Ember.RSVP.hash({
	      userext: this.store.createRecord('userext', {
			  imgurl: imgStr
			}),
	      user: this.store.peekRecord('user', _id)
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'userext', model.userext);
	    Ember.set(controller, 'user', model.user);
	  },
	  actions : {
	  	saveUser(usr) { 
	      usr.save().then(() => {
        		//this.controller.get('model.userext').set('responseMessage', 'Info has been saved');
        		this.controller.get('notifications').success('Saved successfully!',{
				  autoClear: true
				});
	      });
	    },
	    closeMessage() {
	    	this.controller.get('model.userext').set('responseMessage', '');
	    }
	  }
});
