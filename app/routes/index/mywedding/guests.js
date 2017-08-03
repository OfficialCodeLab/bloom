import Ember from 'ember';

export default Ember.Route.extend({
	/*  Route param processor:
		- change routeKeys to different values
    - set up queryParams in controller
		- model(params) -> this.set('params', params)
		- in setupController -> this.processParams
	*/
	params: null,
	routeKeys: {
		'guestList': 0,
		'addGuests': 1,
		'saveTheDate': 2,
		'weddingInvites': 3
	},

	model(params){
		this.set('params', params);
		let _id = this.get("currentUser.uid") + "";
		return this.store.findRecord('wedding', _id);
	},
	setupController: function(controller, model) {
		this._super(controller, model);
		this.processParams(this.get('params'));
	},
	actions: {
		comingSoon: function() {
			this.controller.get('notifications').info('Feature coming very soon!',{
				autoClear: true
			});
		},
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
		select: function(params) {
			this.select(params);
		}
	},

	processParams: function(params) {
		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				if(params[key]) {
					this.select(key);
				}
			}
		}
	},
	select: function(param) {
		let allParams = this.get('routeKeys');
		for (var key in allParams) {
			if (allParams.hasOwnProperty(key)) {
				let setFalse = 'isSelected' + allParams[key];
				this.controller.set(setFalse, false);
			}
		}

		let num = allParams[param];
		let selectStr = 'isSelected' + num;
		this.controller.set(selectStr, true);
		this.setParams(param);
	},
	setParams: function(param) {
		let allParams = this.get('routeKeys');
		for (var key in allParams) {
			if (allParams.hasOwnProperty(key)) {
				this.controller.set(key + "", null);
			}
		}
		this.controller.set(param + "", true);
	}
});
