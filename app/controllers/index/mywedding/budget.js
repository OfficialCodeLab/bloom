import Ember from 'ember';
import format from 'ember-moment/computeds/format';
import momentComputed from 'ember-moment/computeds/moment';
import fromNow from 'ember-moment/computeds/from-now';
import locale from 'ember-moment/computeds/locale';

export default Ember.Controller.extend({
	moment: Ember.inject.service(),
	dateCurrent: format(),
	refresh: true,
	actions: {
		refreshButton(){
			const _this = this;
			this.set('refresh', false);
			Ember.run.next(function () {
		        _this.set('refresh', true);
		    });
		}
	}
});