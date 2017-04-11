import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  email: attr('string'),
  cell: attr('string'),
  guests: attr('string'),
  rsvp: attr('boolean'),
  mustEmail: attr('boolean'),
  wedding: belongsTo('wedding', {inverse: 'guests', async: true}),
  isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
  isValid: Ember.computed.and('name', 'isValidEmail'),
  isNotValid: Ember.computed.not('isValid')
});
