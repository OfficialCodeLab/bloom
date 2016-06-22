import Ember from 'ember';

export default Ember.Route.extend({

init: function(){

},


  beforeModel: function() {
  	var sesh = this.get("session").fetch().catch(function() {});
  	if(!this.get('session.isAuthenticated')){
        this.transitionTo('login');
      } else{
        this.store.findRecord('user', this.get("session").get('currentUser').providerData[0].uid).then(()=>{},()=>this.transitionTo('user.new'));

      }
      return sesh;
  },

  model() {
    //Before creating the record, clear the DS Store

    //this.store.unloadAll('userext');
      let _id = this.get("session").get('currentUser').providerData[0].uid + "";
      let providerId = this.get("session").get('currentUser').providerData[0].providerId;
      let imgStr;
      if(providerId === "facebook.com"){
        imgStr = "http://graph.facebook.com/" + this.get("session").get('currentUser').providerData[0].uid + "/picture?type=large";
      } else {
        let imgStrSM = this.get("session").get('currentUser').photoURL;
        imgStr = imgStrSM.substring(0, imgStrSM.length-11) + ".png";
      }
    return Ember.RSVP.hash({
        userext: this.store.createRecord('userext', {
        imgurl: imgStr
      }),
        user: this.store.peekRecord('user', _id)
      });
  },


  actions: {
      showSingle: function(){
        this.transitionTo('index.item-single');
      }
  }
});
 