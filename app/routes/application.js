import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		toggleMenu: function () {
			if(this.controller.get('menuOpen')){
   				Ember.$('#menu-overlay').fadeOut("slow");
				this.controller.toggleProperty('menuOpen');
			} else{
   				Ember.$('#menu-overlay').fadeIn("slow");
				this.controller.toggleProperty('menuOpen');
			}
		}
	}/*,
	
	setupController: function(controller, model) {
		this.controller.set('menuOpen', false)
		console.log("TEST" + this.controller.get('menuOpen'));
		Ember.$('#menu-overlay').fadeOut("slow");
		

  	}*/
});
