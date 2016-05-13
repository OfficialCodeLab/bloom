import Ember from 'ember';

export default Ember.Route.extend({
	model () {
	  //Before creating the record, clear the DS Store
	  this.store.unloadAll('userext');
      let _id = this.get("session").content.currentUser.id + "";
		return Ember.RSVP.hash({
	      userext: this.store.createRecord('userext', {
			  imgurl: this.get("session").content.currentUser.cachedUserProfile.picture.data.url
			}),
	      user: this.store.peekRecord('user', _id)
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    Ember.set(controller, 'userext', model.userext);
	    Ember.set(controller, 'user', model.user);
	  }
});
