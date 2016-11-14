import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    // if (!this.get('session.isAuthenticated')) {
    //   this.transitionTo('login');
    // }
    return sesh;
  },
  model() {
    // return this.store.createRecord('contact');
  },


  actions: {

    // saveContact(newContact) {
    //   let user_id;
    //   if (this.get("session").get('currentUser') !== undefined){
    //     user_id = this.get("session").get('currentUser').providerData[0].uid;
    //   } else {
    //     user_id = "Anonymous user";
    //   }
    //   if (this.controller.get('captchaVerified')) {
    //     let message = this.store.createRecord('message', {
    //       to: "info@codelab.io",
    //       from: this.controller.get('model').get('email'),
    //       subject: "New Contact request from " + this.controller.get('model').get('email'),
    //       html: this.controller.get('model').get('message'),
    //       senderId: user_id
    //     });
    //     message.save();

    //     newContact.save().then(() => {
    //       this.controller.get('model').set('email', '');
    //       this.controller.get('model').set('message', '');
    //       //this.controller.get('model').set('responseMessage', 'Message has been sent');
    //       this.controller.get('notifications').info('Message sent successfully!',{
    //         autoClear: true
    //       });
    //     });
    //   }
    //},

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
