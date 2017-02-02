import Ember from 'ember';

export default Ember.Route.extend({
	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('wedding', _id);	
	},
	actions: {
		allClick: function(){
			this.controller.set('viewAll', true);
		},
		incompleteClick: function(){
			this.controller.set('viewAll', false);

		},
		saveTodo: function(){
			alert('caught');
			this.send('saveTodo');
		}
	}
        
});