import Ember from 'ember';

export default Ember.Route.extend({
    model () {
		let _id = this.get("currentUser.uid") + "";
		return Ember.RSVP.hash({
	      user: this.store.findRecord('user', _id),
	      icon: this.store.findAll('icon')
	    });
	},
	setupController(controller, model) {
	    this._super(controller, model);
	    // var sesh = this.get("session").fetch().catch(function() {});
	    Ember.set(controller, 'user', model.user);
	    Ember.set(controller, 'icon', model.icon);
	    try {
		    let birthday = model.user.get('birthday');
		  	controller.set('birthday', birthday);
	    } catch (ex) {}

	    try {
		    if(this.get("session").get('currentUser').providerData[0].providerId === "password") {
		    	controller.set('isPasswordAccount', true);
		    }
	    } catch (ex) {}
	  },
	  actions: {
  		dateChanged: function (date, valid){
  			if(valid){
  				this.controller.set('birthday', date);
  				let _id = this.get("currentUser.uid") + "";
  				let user = this.store.peekRecord('user', _id);
  				user.set('birthday', date);
  				// this.dateDiff(this.controller.get('computedSelected'), this.controller.get('dateCurrent'));
  				// wedding.save();
  			}
  		},
      openModal: function() {
        // this.send('showModal', 'modal-icon-picker', task);

      },
      editSpouse: function() {
        let _id = this.get("currentUser.uid") + "";
        let user = this.store.peekRecord('user', _id);
        let usr = this.store.createRecord('edit-value-modal', {
          title: "Enter your spouse's name",
          _id: _id,
          value: user.get('spouse')
        });
        this.controller.set('storedUsrDataId', usr.id);
        console.log(usr.id);
        this.send('showModal', 'modal-edit-value', usr);
      },
      saveValue: function() {
        let id = this.controller.get('storedUsrDataId');
        let usr = this.store.peekRecord('edit-value-modal', id);
        let newName = usr.get('value');
        let _id = this.get("currentUser.uid") + "";
        let user = this.store.peekRecord('user', _id);
        user.set('spouse', newName);
        user.save().then(()=>{
          this.controller.get('notifications').success('Updated successfully!',{
    			  autoClear: true
    			});
        });
      },
      closeEditValue: function() {
        let id = this.controller.get('storedUsrDataId');
        let usr = this.store.peekRecord('edit-value-modal', id);
        usr.deleteRecord();
        this.controller.set('storedUsrDataId', null);
        this.send('removeModal');
      },
      hideIconSelection: function() {
        this.controller.set("showAccount", true);
      },
      showIconSelection: function() {
        this.controller.set("showAccount", false);

      },
      saveIcon: function(id) {
        let icon = this.store.peekRecord('icon', id);
        let _id = this.get("currentUser.uid") + "";
        let user = this.store.peekRecord('user', _id);
        user.set('icon', icon);
        user.save().then(()=>{
          this.controller.get('notifications').success('Updated successfully!',{
    			  autoClear: true
    			});
          this.controller.set("showAccount", true);
        })
      }
	  }
});
