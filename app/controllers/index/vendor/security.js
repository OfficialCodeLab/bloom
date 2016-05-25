import Ember from 'ember';

export default Ember.Controller.extend({
	showPartial: Ember.computed.or('showEmailPartial', 'showPasswordPartial'),
	showEmailPartial: '',
	showPasswordPartial: '',
	actions: {
		showPasswordChangePartial(){
			this.set('showPasswordPartial', true);
		},

		showEmailChangePartial(){
			this.set('showEmailPartial', true);
		},
		backBtn(){
			this.set('showPasswordPartial', false);
			this.set('showEmailPartial', false);
		}
	}
});
