import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	email: attr('string'),
	message: attr('string'),
	responseMessage: attr('string'),

	isValid: Ember.computed.match('email', /^.+@.+\..+$/),
	isLongFive: Ember.computed.gte('message.length', 5),
	isEnabled: Ember.computed.and('isValid', 'isLongFive'),
	isDisabled: Ember.computed.not('isEnabled')
});
 