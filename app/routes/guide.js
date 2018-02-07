import Ember from 'ember';

export default Ember.Route.extend({
	actions: {

		ok: function(){
			let guest = this.controller.get('guestToDestroy');
			this.controller.get('guestsA').removeObject(guest);
			this.controller.get('notifications').info('Guest has been removed from your list!',{
                autoClear: true
            }); 
		},
	}
});
