import Ember from 'ember';

export default Ember.Controller.extend({
	masonryRef: '',
	actions: {
		storeMasonryRef(ref){
			this.set('masonryRef', ref);
		},
		loadedImg(){
			try{
			  	var $container = this.get('masonryRef');
			  	$container.layout();				
			} catch(ex){}
			//console.log("THIS WORKS");
		},
	    removedFavourite(){
	    	//console.log("TESTERINO");
		  	var $container = this.get('masonryRef');
		  	$container.masonry('layout');
	    },
	}
});
