import Ember from 'ember';

export default Ember.Route.extend({

	filepicker: Ember.inject.service(),

	actions: {
	    openFilePicker: function(){
	    	this.get('filepicker.promise').then(function(filepicker){
	            //do something with filepicker
	            filepicker.pick(function(Blob){  console.log(Blob.url);  });
	        });
	    }

	}
});
