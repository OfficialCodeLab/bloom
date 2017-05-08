import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

export default Model.extend({
	email: attr('string'),
	message: attr('string'),
	responseMessage: attr('string'),
	vendor: attr('string'),
	vendorEmail: attr('string'),
	vendorId: attr('string'),
	subject: attr('string'),
	sendInfo: attr('bool'),
	isValid: Ember.computed.match('email', /^.+@.+\..+$/),
	isLong: Ember.computed.gte('message.length', 5),
	isEnabled: Ember.computed.and('isValid', 'isLong'),
	isDisabled: Ember.computed.not('isEnabled'),
	sendInfoText: Ember.computed('sendInfo', function(){
        if (this.get('sendInfo')) {
            return "Yes Please!";
        } else {
            return "No thanks";
        }
    }),
});
 