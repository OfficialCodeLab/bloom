import Ember from 'ember';

export default Ember.Route.extend({
	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
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
			// alert("STOP RIGHT THERE CRIMINAL SCUM"); 
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
			guest.save().then(()=>{
    			//Success notification
    			this.controller.get('notifications').info('Guest updated successfully!',{
				    autoClear: true
				});
    		});
		}
	}
        
});