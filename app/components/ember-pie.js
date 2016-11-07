import Ember from 'ember';

const EmberPieComponent = Ember.Component.extend({
	allGuests: 0,
	attendingGuests: 0,
	chartData: [],
  	storeName: '',
  	processedGuests: 0,
  	processedObserver: Ember.observer('processedGuests', function() {
        if(this.get('processedGuests') === this.get('guestsCount')){
			this.set('chartData', Ember.A([
				{
			        value: this.get('allGuests') - this.get('attendingGuests'),
			        color: "#808080",
			        highlight: "#9E9E9E",
			        label: "Not Attending"
			    }, 
			    {
			        value: this.get('attendingGuests'),
			        color: "#F48FB1",
			        highlight: "#F8BBD0",
			        label: "Attending"
			    }
	    	]));
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
		_that.set('processedGuests', processedGuests);
		wedding.get('guests').forEach(function(guest){	
			guestsCount++;
			store.findRecord('guest', guest.get('id')).then((_guest)=>{
				if (_guest.get('rsvp') === true){
					totalAttending += 1 + parseInt(_guest.get('guests'));
					_that.set('attendingGuests', totalAttending);
				}
				totalUsers = totalUsers + 1 + parseInt(_guest.get('guests'));
				_that.set('allGuests', totalUsers);
				processedGuests++;
				_that.set('processedGuests', processedGuests);
			});
		});
		this.set('guestsCount', guestsCount);
		
	},
});

EmberPieComponent.reopenClass({
  positionalParams: ['userid']
});

export default EmberPieComponent;