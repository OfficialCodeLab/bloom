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
		}
	}
        
});