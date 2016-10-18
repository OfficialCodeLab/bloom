import Ember from 'ember';

export default Ember.Controller.extend({
	masonryRef: '',
	isLoaded: false,
	isNotLoaded: Ember.computed.not('isLoaded'),
	percentLoaded: 0,
	percentLoadedStyle: 'width: 0%',
	actions: {
		storeMasonryRef(ref){
			this.set('masonryRef', ref);
		},
		// loadedImg(){
		// 	try{
		// 	  	var $container = this.get('masonryRef');
		// 	  	$container.layout();				
		// 	} catch(ex){}
		// 	//console.log("THIS WORKS");
		// },
	    removedFavourite(){
	    	//console.log("TESTERINO");
		  	var $container = this.get('masonryRef');
		  	$container.masonry('layout');
	    },
	}
});
