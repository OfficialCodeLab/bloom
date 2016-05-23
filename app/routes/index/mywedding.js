import Ember from 'ember';

export default Ember.Route.extend({

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
	}
});
