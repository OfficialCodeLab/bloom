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
	model () {
	  //Before creating the record, clear the DS Store
	  this.store.unloadAll('userext');
      let _id = this.get("session").content.currentUser.id + "";
      let imgStr = "http://graph.facebook.com/" + this.get("session").content.currentUser.id + "/picture?type=large";
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
        		this.controller.get('model.userext').set('responseMessage', 'Info has been saved');
	      });
	    },
	    closeMessage() {
	    	this.controller.get('model.userext').set('responseMessage', '');
	    }
	  }
});
