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
	notifications: Ember.inject.service('notification-messages'),
	// computedFromNow: fromNow(momentComputed('selectedDate'), false), 
	computedFromNow: 0,
	daysNum: 0,
	daysString: '',
	refresh: true,
	oldTotal: 0,
	oldUsed: 0,
	topVendor: null,
	email: '',
	cell: '',
	city: '',
	birthday: null,
	birthdayComputed: format('birthday', 'Do MMMM YYYY'),
	actions: {
		refreshButton(){
			const _this = this;
			this.set('refresh', false);
			Ember.run.next(function () {
		        _this.set('refresh', true);
		    });
		}
	},
	demoTasks: [ 
	  { title: 'Create a Bloom Account', completed: true },
	  { title: 'Set up a Budget', completed: false },
	  { title: 'Create a To-do List', completed: false },
	  { title: 'Set your Wedding Date', completed: false },
	  { title: 'Invite Guests', completed: false }
  	]
});