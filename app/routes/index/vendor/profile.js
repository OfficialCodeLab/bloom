import Ember from 'ember';

export default Ember.Route.extend({

	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }

      	  let _id = this.get("session").get('currentUser').providerData[0].uid + "";
          let user = this.store.peekRecord('user', _id);
          if(!user.get('vendorAccount')){
          	this.transitionTo('index.vendor.login');
          }
          return sesh;
    },
    model(){    	
	    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		let user = this.store.peekRecord('user', _id);
    	return this.store.findRecord('vendor', user.get('vendorAccount'));
    },
    actions: {
    	saveChanges() {
        let model = this.controller.get('model');
        this.controller.set('isUpdating', true);
        model.save().then(() => {
         this.controller.set('isUpdating', false);
          this.controller.get('notifications').success('Changes have been saved!',{
              autoClear: true
            });

        });
    	},
      select0: function(){
        this.controller.set('isSelected0', true);
        this.controller.set('isSelected1', false);
        this.controller.set('isSelected2', false);
      },
      select1: function(){
        this.controller.set('isSelected0', false);
        this.controller.set('isSelected1', true);
        this.controller.set('isSelected2', false);
      },
      select2: function(){
        this.controller.set('isSelected0', false);
        this.controller.set('isSelected1', false);
        this.controller.set('isSelected2', true);
      },
    	closeMessage(){
    		this.controller.set('responseMessage', '');
    	}
    }
});
