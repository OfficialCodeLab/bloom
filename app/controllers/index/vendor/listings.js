import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	masonryRef: '',
	isLoaded: false,
	isNotLoaded: Ember.computed.not('isLoaded'),
	percentLoaded: 0,
	actions: {
		storeMasonryRef(ref){
			this.set('masonryRef', ref);
		},
	    // removedFavourite(){
	    // 	//console.log("TESTERINO");
		  	// var $container = this.get('masonryRef');
		  	// $container.masonry('layout');
	    // },
	}
});