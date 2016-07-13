import Ember from 'ember';

export default Ember.Route.extend({
  //Sets the current logged in user as the model
  model(){
    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('user', _id);
  },
  actions: {
    findImage(user){
      //This is for finding a user's profile image.
      //Not quite sure how to send this back to handlebars.

      imgStr = "http://graph.facebook.com/" + user.id + "/picture?type=large";
      console
      return imgStr;
    },
    showWedding(friendID){
      // TODO: Add function for transitioning to wedding route

      //1. Get user's wedding

      //2. Transition to user's single wedding page
    }
  }

});
