import Ember from 'ember';
import format from 'ember-moment/computeds/format';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	section0: true,
	section1: false,
    queryParams: ['isTesting'],
    percentLoaded: 50,    
	dateCurrent: format()
});
