import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement(){
		// this.$('.cat-img-container').imagesLoaded( function() {
		// 	console.log("Images have all loaded!");
		// })
	    this.$().imagesLoaded( function( $images, $proper, $broken ) {
	      console.log( $images.length + ' images total have been loaded' );
	      console.log( $broken.length + ' broken images' );
	    });
	}
});
