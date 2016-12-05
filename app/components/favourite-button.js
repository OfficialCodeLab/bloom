import Ember from 'ember';
import ResetScrollPositionMixin from 'pear/mixins/reset-scroll';

const FavouriteButtonComponent = Ember.Component.extend({
  	storeName: '',
  	favourited: false,
	metrics: Ember.inject.service(),
	willInsertElement: function (){
        this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
		let _id = this.get('userid');
		let _itemid = this.get('itemid');
		let user = store.peekRecord('user', _id);
		var _that = this;
		user.get('favourites').forEach(function(favourite){
			if(favourite.get('id') === _itemid){
				_that.set('favourited', true);
				return;
			} 
		});

	},
	actions: {
		toggleFavourite: function(){
			let _id = this.get('userid');
			let _itemid = this.get('itemid');
        	let store = this.get('storeName');
	    	let user = store.peekRecord('user', _id);
	    	let item = store.peekRecord('cat-item', _itemid);
	    	
			if(this.get('favourited')){
				this.set('favourited', false);
	    		user.get('favourites').removeObject(item);
	    		item.get('favouritedBy').removeObject(user);
			} else {				
				this.set('favourited', true);
	    		user.get('favourites').pushObject(item);
	    		item.get('favouritedBy').pushObject(user);	
	    		item.get('vendor').then((vendor) =>{
	    			let _vendorId = vendor.get('id');
		    		this.storeFavourite(_vendorId, _id, _itemid);
		    	});    		
	    		
			}
    		user.save().then(()=>{
    			item.save();
    		});
	    }
	},

	storeFavourite: function(vendorId, userId, itemId){
		let prop = userId + " favourited: " + itemId;
    	let metrics = Ember.get(this, 'metrics');
		
		metrics.trackEvent('GoogleAnalytics', {
		    // (required) The name you supply for the group of objects you want to track.
		   category: vendorId,
		    // (required) A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object.
		   action: 'Favourited Item',
		   // (optional) string to provide additional dimensions to the event data.
		   label: prop,
		   // (optional) An integer that you can use to provide numerical data about the user event.
		   value: 1
		   // (optional) boolean that when set to true, indicates that the event hit will not be used in bounce-rate calculation.
		   //noninteraction: false
		});

		//Try mixpanel too, might not work
		metrics.trackEvent('Mixpanel', {
		 'event': 'Favourited Item',
		 'custom-property1': vendorId,
		 'custom-property2': prop,
		});
    }
});

FavouriteButtonComponent.reopenClass({
  positionalParams: ['itemid', 'userid']
});

export default FavouriteButtonComponent;