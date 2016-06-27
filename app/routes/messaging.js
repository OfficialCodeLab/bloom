import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
    return sesh;
  },
  model() {
    return this.store.createRecord('message');
  },
  activate: function() {
    window.scrollTo(0, 0);
  },

  actions: {
    sendMessage() {
      let message = this.store.createRecord('message', {
        to: this.controller.get('model').get('to'),
        from: this.controller.get('model').get('from'),
        subject: this.controller.get('model').get('subject'),
        html: this.controller.get('model').get('html')
      });
      alert("Message sent! I think.");
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
