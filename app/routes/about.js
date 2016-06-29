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
    return this.store.createRecord('contact');
  },


  actions: {

    saveContact(newContact) {
      if (this.controller.get('captchaVerified')) {
        let message = this.store.createRecord('message', {
          to: "info@codelab.io",
          from: this.controller.get('model').get('email'),
          subject: "New Contact request from " + this.controller.get('model').get('email'),
          html: this.controller.get('model').get('message')
        });
        message.save();

        newContact.save().then(() => {
          this.controller.get('model').set('email', '');
          this.controller.get('model').set('message', '');
          this.controller.get('model').set('responseMessage', 'Message has been sent');
        });
      }
    },

    willTransition() {
      // rollbackAttributes() removes the record from the store
      // if the model 'isNew'
      this.controller.get('model').set('responseMessage', '');
      this.controller.get('model').rollbackAttributes();
    },
    closeMessage() {
      this.controller.get('model').set('responseMessage', '');
    },
    guidedSearch() {
      window.scrollTo(0, 0);
      this.transitionTo('guide');
    }

  }
});
