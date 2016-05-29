import Ember from 'ember';

export default Ember.Controller.extend({
	masonryRef: '',
	actions: {
		storeMasonryRef(ref){
			this.set('masonryRef', ref);
		},
    removedFavourite(){
    	//console.log("TESTERINO");
	  	var $container = this.get('masonryRef');
	  	$container.masonry('layout');
    },
	}
});
