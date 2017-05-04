import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
    passwordLength: Ember.computed.gte('password.length', 8),
    section1: true,
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    id: '',
    isCreating: false
});
