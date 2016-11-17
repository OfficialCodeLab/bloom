import Ember from 'ember';

const GuestCounterComponent = Ember.Component.extend({
	allGuests: 0,
	attendingGuests: 0,
  	storeName: '',
  	processedGuests: 0,
  	processedObserver: Ember.observer('processedGuests', function() {
        if(this.get('processedGuests') === this.get('guestsCount')){
        	let _id = this.get('userid');
        	let store = this.get('storeName');
        	let wedding = store.peekRecord('wedding', _id);
			wedding.set('guestsTotal', this.get('allGuests'));
        	wedding.set('guestsAttending', this.get('attendingGuests'));
        	wedding.save();
        }
	}),

	willInsertElement: function(){
		this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
        let _id = this.get('userid');
        let wedding = store.peekRecord('wedding', _id);
		let totalUsers = 0;
		let totalAttending = 0;
		let _that = this;
		let guestsCount = 0;
		let processedGuests = 0;
		let guests = wedding.get('guests');

    	wedding.set('guestsTotal', this.get('allGuests'));
    	
		_that.set('processedGuests', processedGuests);
		wedding.get('guests').forEach(function(guest){	
			guestsCount++;
			store.findRecord('guest', guest.get('id')).then((_guest)=>{
				if (_guest.get('rsvp') === true){
					totalAttending += 1 + parseInt(_guest.get('guests'));
					_that.set('attendingGuests', totalAttending);
				}
				totalUsers += 1 + parseInt(_guest.get('guests'));
				_that.set('allGuests', totalUsers);
				processedGuests++;
				_that.set('processedGuests', processedGuests);
			});
		});
		this.set('guestsCount', guestsCount);
		if(guestsCount===0){
    		wedding.set('hasGuests', false);
			wedding.set('guestsTotal', 0);
        	wedding.set('guestsAttending', 0);
    	} else {
    		wedding.set('hasGuests', true);
    	}
    	wedding.save();		
	},
});

GuestCounterComponent.reopenClass({
  positionalParams: ['userid']
});

export default GuestCounterComponent;