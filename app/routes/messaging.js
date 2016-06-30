import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
    return sesh;
  },
  model: function(params) {
  // this.controller.set("modelParams", params.id);
  // return Ember.RSVP.hash({
  //   vendor:
    return this.store.findRecord('vendor', params.vendor_id);
    //
    // });
  },
  afterModel() {

  },
  setupController(controller, model) {
    this._super(controller, model);

    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
    this.store.findRecord('user', _id).then((currentUser)=>{
      this.controller.set('from', currentUser.get('email'));
    }, ()=>{});
  },

  actions: {
    didTransition: function() {
      let _id = this.get("session").get('currentUser').providerData[0].uid + "";
      this.store.findRecord('user', _id).then((currentUser) => {
        this.controller.set('from', currentUser.get('email'));
      }, () => {});
    },

    sendMessage() {
      //Store the current user in a temporary variable
      let _id = this.get("session").get('currentUser').providerData[0].uid + "";
      let currentUser = this.store.findRecord('user', _id).then((currentUser) => {
        //Create a message to be sent through
        let message = this.store.createRecord('message', {
          to: this.controller.get('model').get('email'),
          from: this.controller.get('from'),
          subject: this.controller.get('subject'),
          html: this.controller.get('html'),
          senderName: currentUser.get("name"),
          senderId: _id,
          receiverName: this.controller.get('model').get('name')
        });
        // alert("Message sent! I think.\n" + JSON.stringify(this.controller.get('currentMessage')));
        // alert("Message sent! I think.\n" + this.model.get('vendor'));
        message.save();
        this.controller.set("messageSent", true);
        this.controller.set("subject", "");
        this.controller.set("html", "");
      }, () => {});


    },
    closeMessage: function(){
      this.controller.set("messageSent", false);
    },
    goBack: function() {
      window.history.go(-1);
      //console.log("This works.");
    }
  }
});
