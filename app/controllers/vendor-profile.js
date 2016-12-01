import Ember from 'ember';

export default Ember.Controller.extend({
	masonryRef: '',
	isLoaded: false,
	isNotLoaded: Ember.computed.not('isLoaded'),
	percentLoaded: 0,
	contactInfoVisible: false,
	actions: {
		storeMasonryRef(ref){
			this.set('masonryRef', ref);
		},
	    removedFavourite(){
	    	//console.log("TESTERINO");
		  	var $container = this.get('masonryRef');
		  	$container.masonry('layout');
	    }
	}
});
