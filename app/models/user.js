import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember'

export default Model.extend({
  name: attr('string'),
  surname: attr('string'),
  email: attr('string'),
  addressL1: attr('string'),
  addressL2: attr('string'),
  city: attr('string'),
  country: attr('string'),
  postalcode: attr('string'),
  cell: attr('string'),
  accountType: attr('string')
});
