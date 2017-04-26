import Ember from 'ember';

export default Ember.Controller.extend({
	masonryRef: '',
	isLoaded: false,
	isNotLoaded: Ember.computed.not('isLoaded'),
	percentLoaded: 0,
	isFirst: true,
	isLast: false,
	pageTotal: 0,
	pageNum: 1,
	scroller: Ember.inject.service(),
	pgNum: Ember.computed('pageNum', function() {
		if(this.get('pageNum') < 10){
			return "0" + this.get('pageNum');
		}

		return this.get('pageNum');
	}),
	pgTotal: Ember.computed('pageTotal', function() {
		if(this.get('pageTotal') < 10){
			return "0" + this.get('pageTotal');
		}

		return this.get('pageTotal');
	}),
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
