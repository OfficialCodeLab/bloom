import Ember from 'ember';

export default Ember.Component.extend({
	currentBackground: 0,
	calledOnce: false,
	refreshIntervalId: 0,
	// backgrounds: ['https://newevolutiondesigns.com/images/freebies/colorful-background-17.jpg', 'http://www.planwallpaper.com/static/images/518164-backgrounds.jpg', 'http://www.planwallpaper.com/static/images/maxresdefault_5aMEgAt.jpg'],
	backgrounds: ["bg1.jpg", "6.jpg", "splash1.jpg"],
	didInsertElement: function(){
	  let _that = this;
	  if(this.get('calledOnce') === false){
	      this.set('calledOnce', true);
	      let _refreshIntervalId = setInterval(function() {
	      	_that.changeBackground();
	      }, 4000);	
	      this.set('refreshIntervalId', _refreshIntervalId);	  	
	  }
	},
	willDestroyElement: function(){
		let _refreshIntervalId = this.get('refreshIntervalId');
		clearInterval(_refreshIntervalId);
	},
	changeBackground: function(){
      
		var backgrounds = this.get('backgrounds');
        var _currentBackground = this.get('currentBackground');
		Ember.$('#section1-bg').fadeIn(0);
		_currentBackground++;
		if(_currentBackground > 2) {
		_currentBackground = 0;
		} 

		this.set('currentBackground', _currentBackground);

		var img = Ember.$('#section1-bg');

		Ember.$('#section1').css({
		    'background-image' : "url('" + backgrounds[_currentBackground] + "')"
		});
		Ember.$('#section1-bg').fadeOut(1000,function() {
			Ember.$('#section1-bg').css({
			      'background-image' : "url('" + backgrounds[_currentBackground] + "')"
			});
		});
    }
});
