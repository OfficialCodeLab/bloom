import Ember from 'ember';

export default Ember.Route.extend({
  params: null,
  model(params) {
		this.set('params', params);
  },

	setupController: function(controller, model) {
		this._super(controller, model);
		this.processParams(this.get('params'));
	},
  actions : {
    acceptInvite() {
      this.acceptInvite(this.get('guestId'));
    },
    declineInvite() {
      this.declineInvite(this.get('guestId'));
    }
  },

  processParams: function(params) {
    // In future, maybe ping the user (params.id)
    if(params) {
      if(params.id) {
        if(params.accept){
          this.acceptInvite(params.accept);
        } else {
          if(params.decline) {
            this.declineInvite(params.decline);
          } else {
            this.controller.set('noParams', true);
          }
        }
      } else {
        this.controller.set('noParams', true);
      }
    } else {
      this.controller.set('noParams', true);
    }
  },
  acceptInvite: function(id) {
    this.controller.set('isProcessed', false);
    this.set('guestId', id);
    this.store.findRecord('guest', id).then((guest)=>{
      guest.set('rsvp', true);
      guest.save().then(() => {
        this.controller.set('isAttending', true);
        this.controller.set('isProcessed', true);
      });
    });
  },
  declineInvite: function(id) {
    this.controller.set('isProcessed', false);
    this.set('guestId', id);
    this.store.findRecord('guest', id).then((guest)=>{
      guest.set('rsvp', false);
      guest.save().then(() => {
        this.controller.set('isAttending', false);
        this.controller.set('isProcessed', true);
      });
    });
  },

});
