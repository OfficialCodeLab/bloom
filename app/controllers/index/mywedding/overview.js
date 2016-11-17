import Ember from 'ember';
import format from 'ember-moment/computeds/format';
import momentComputed from 'ember-moment/computeds/moment';
import fromNow from 'ember-moment/computeds/from-now';
import locale from 'ember-moment/computeds/locale';

export default Ember.Controller.extend({
	selectedDate: null,
	moment: Ember.inject.service(),
	computedSelected: format('selectedDate'),
	dateComputed: format('selectedDate', 'MMM Do, YY'),
	dateCurrent: format(),
	// computedFromNow: fromNow(momentComputed('selectedDate'), false), 
	computedFromNow: 0,
	daysNum: 0,
	daysString: ''
});