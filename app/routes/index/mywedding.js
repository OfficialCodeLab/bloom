import Ember from 'ember';

export default Ember.Route.extend({
	model () {
	  //Before creating the record, clear the DS Store
	  this.store.unloadAll('userext');
      let _id = this.get("currentUser.uid") + "";
      let imgStr = "http://graph.facebook.com/" + this.get("currentUser.uid") + "/picture?type=large";
		return Ember.RSVP.hash({
	      userext: this.store.createRecord('userext', {
			  imgurl: imgStr
			}),
	      user: this.store.findRecord('user', _id),
	      wedding: this.store.findRecord('wedding', _id)
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'userext', model.userext);
	    Ember.set(controller, 'user', model.user);
	    Ember.set(controller, 'wedding', model.wedding);
    },
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      } else {
		        this.store.findRecord('user', this.get("currentUser.uid")).then((user)=>{
							if (user.get('accountType') === 'vendor' && !(user.get('specialAccount'))) {
								this.transitionTo('index.vendor');
							}
						});
				}
	      return sesh;
    }
});
