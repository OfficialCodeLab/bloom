import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		var user = this.store.createRecord('user', {
		  name: this.get("session").content.currentUser.cachedUserProfile.first_name,
		  surname: this.get("session").content.currentUser.cachedUserProfile.last_name,
		  id: this.get("session").content.currentUser.id
		});
	    //return this.store.createRecord('user');
	    return user;
    },
    beforeModel() {
	
      //this.set("user.name", this.get("session").content.currentUser.name);
  },
    actions: {

    saveUser(newUser) {
      newUser.set("id", this.get("session").content.currentUser.id);

      newUser.save().then(() => this.transitionTo('index'));
    },

    willTransition() {
      // rollbackAttributes() removes the record from the store
      // if the model 'isNew'
      this.controller.get('model').rollbackAttributes();
    },
    testA(){

		alert(this.controller.get('model').get("name"));
    }
  }

});