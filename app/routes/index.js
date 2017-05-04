import Ember from 'ember';

export default Ember.Route.extend( {


  beforeModel: function() {
  	var sesh = this.get("session").fetch().catch(function() {});
  	if(!this.get('session.isAuthenticated')){
        this.transitionTo('login');
      } else{
        this.store.findRecord('user', this.get("session").get('currentUser').providerData[0]._uid).then(()=>{},()=>this.transitionTo('user.new'));

      }
      return sesh;
  },
  
  setupController(controller, model) {
      this._super(controller, model);
      Ember.set(controller, 'userext', model.userext);
      Ember.set(controller, 'user', model.user);
      model.user.set('imgurl', model.userext.get('imgurl'));
      model.user.save();
  },
  model() {
    //Before creating the record, clear the DS Store

    //this.store.unloadAll('userext');
      let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
      let providerId = this.get("session").get('currentUser').providerData[0].providerId;
      let imgStr;
      if(providerId === "facebook.com"){
        imgStr = "http://graph.facebook.com/" + this.get("session").get('currentUser').providerData[0]._uid + "/picture?type=large";
      } else {
        if(this.get("session").get('currentUser').providerData[0].photoURL) {
          let imgStrSM = this.get("session").get('currentUser').providerData[0].photoURL;
          imgStr = imgStrSM.substring(0, imgStrSM.length-11) + imgStrSM.substring(imgStrSM.length-4, imgStrSM.length);          
        } else {
          imgStr = '../favicon.png';
        }
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
 