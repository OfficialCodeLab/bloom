import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		let _id = this.get("currentUser.uid") + "";
		return this.store.findRecord('wedding', _id);
	},
	actions: {
		ok: function () {
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			switch(_modalData.get('action')) {
				case 'delete':

					let model = this.store.peekRecord('guest', this.controller.get('guestId'));
					model.destroyRecord().then(()=>{
						this.controller.get('notifications').info('Guest has been removed!',{
							autoClear: true
						});

					});
					break;
			}
		},
		willTransition: function (transition){
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			if(_modalData){
				_modalData.deleteRecord();
			}
		},
		closeGuestModal: function () {
			// Clean up dirty attributes
			if(this.get('isGuestSaved') === false){
				let id = this.controller.get('guestEditId');
	    		let guest = this.store.peekRecord('guest', id);
	    		guest.rollbackAttributes();
			}

			this.send('closedGuestModal');
		},
		editGuest: function(id){
    		let guest = this.store.peekRecord('guest', id);
			this.send('openGuestModal', guest);
			this.controller.set('guestEditId', id);
			this.set('isGuestSaved', false);
		},
		saveGuest: function(){
			// this.send('saveGuest');
			this.set('isGuestSaved', true);
			let guestId = this.controller.get('guestEditId');
			this.controller.set('guestEditId', null);
			let guest = this.store.peekRecord('guest', guestId);
			if(guest.get('isNotValid')) { //Check validity of info
	    		guest.rollbackAttributes();
    			this.controller.get('notifications').error('Guest needs a name and valid email!',{
				    autoClear: true
				});
			} else {
				guest.save().then(()=>{
	    			//Success notification
	    			this.controller.get('notifications').info('Guest updated successfully!',{
					    autoClear: true
					});
	    		});
			}
		},
	    select0: function(){
	        this.controller.set('isSelected0', true);
	        this.controller.set('isSelected1', false);
	        this.controller.set('isSelected2', false);
	        this.controller.set('isSelected3', false);
	    },
	    select1: function(){
	        this.controller.set('isSelected0', false);
	        this.controller.set('isSelected1', true);
	        this.controller.set('isSelected2', false);
	        this.controller.set('isSelected3', false);
	    },
	    select2: function(){
	        this.controller.set('isSelected0', false);
	        this.controller.set('isSelected1', false);
	        this.controller.set('isSelected2', true);
	        this.controller.set('isSelected3', false);
	    },
	    select3: function(){
	        this.controller.set('isSelected0', false);
	        this.controller.set('isSelected1', false);
	        this.controller.set('isSelected2', false);
	        this.controller.set('isSelected3', true);
	    },
	}

});
