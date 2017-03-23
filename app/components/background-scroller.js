import Ember from 'ember';
var Promise = Ember.RSVP.Promise;

export default Ember.Component.extend({

	currentBackground: -1,  //Currently active background
	calledOnce: false,	  //Prevent multiple calls
	refreshIntervalId: 0, //Used for GC

	backgrounds: ["splash-bg1.jpg", "splash-bg2.jpg", "splash-bg3.jpg", "splash-bg4.jpg", "splash-bg5.jpg"],

	//Initialize script when component is inserted
	didInsertElement: function(){
	  let _that = this;
	  if(this.get('calledOnce') === false){
	  		_that.changeBackground();
	      this.set('calledOnce', true);
	      let _refreshIntervalId = setInterval(function() {
	      	_that.changeBackground();
	      }, 8000);	
	      this.set('refreshIntervalId', _refreshIntervalId);	  	
	  }
	},

	//GC clean up to stop script running once route changes
	willDestroyElement: function(){
		let _refreshIntervalId = this.get('refreshIntervalId');
		clearInterval(_refreshIntervalId);
	},

	//Script to change between backgrounds gracefully
	changeBackground: function(){
      
		var backgrounds = this.get('backgrounds');
        var _currentBackground = this.get('currentBackground');
		Ember.$('#section1-bg').fadeIn(0);
		_currentBackground++;
		if(_currentBackground >= backgrounds.length) {
			_currentBackground = 0;
		} 

		this.set('currentBackground', _currentBackground);
		let url = backgrounds[_currentBackground];

		//Image preloader
		new Promise((resolve, reject) => {
	      let image = new Image();
	      image.onload = resolve;
	      image.onerror = reject;
	      image.src = url;
	    }).then(()=>{ //Once image has been loaded
			var img = Ember.$('#section1-bg');

			Ember.$('#section1').css({
			    'background-image' : "url('" + url  + "')"
			});
			Ember.$('#section1-bg').fadeOut(2000,function() {
				Ember.$('#section1-bg').css({
				      'background-image' : "url('" + backgrounds[_currentBackground] + "')"
				});
			});	    	
	    });
    }
});
