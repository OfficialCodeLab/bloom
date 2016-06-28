import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
    return sesh;
  },
  // setupController(controller, model) {
  //   this._super(controller, model);
  // },
  model: function(params) {
    // this.controller.set("modelParams", params.id);
    // return Ember.RSVP.hash({
    //   vendor:
    return this.store.findRecord('vendor', params.vendor_id);
    //
    // });
  },
  afterModel(){
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		this.store.findRecord('user', _id).then((currentUser)=>{
			this.controller.set('from', currentUser.get('email'));
		}, ()=>{});
	},

  actions: {
    sendMessage() {
      let message = this.store.createRecord('message', {
        to: this.controller.get('model').get('email'),
        from: this.controller.get('from'),
        subject: this.controller.get('subject'),
        html: this.controller.get('html')
      });
      // alert("Message sent! I think.\n" + JSON.stringify(this.controller.get('currentMessage')));
      // alert("Message sent! I think.\n" + this.model.get('vendor'));
      message.save();

      // newContact.save().then(() => {
      //   this.controller.get('model').set('email', '');
      //   this.controller.get('model').set('message', '');
      //   this.controller.get('model').set('responseMessage', 'Message has been sent');
      // });
    },
    goBack: function() {
      window.history.go(-1);
      //console.log("This works.");
    }
  }
});
