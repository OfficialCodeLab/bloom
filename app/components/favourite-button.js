import Ember from 'ember';

const FavouriteButtonComponent = Ember.Component.extend({
  	storeName: '',
  	favourited: false,
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
			} else{				
				this.set('favourited', true);
	    		user.get('favourites').pushObject(item);
	    		item.get('favouritedBy').pushObject(user);
			}
    		user.save().then(()=>{
    			item.save();
    		});
	    }
	}
});

FavouriteButtonComponent.reopenClass({
  positionalParams: ['itemid', 'userid']
});

export default FavouriteButtonComponent;