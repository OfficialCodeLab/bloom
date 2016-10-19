import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  desc: attr('string'),
  price: attr('string'),
  category: belongsTo('category', {inverse: 'catItems', async: true}),
  vendor: belongsTo('vendor', {inverse: 'catItems', async: true}),
  favouritedBy: hasMany('user'),
  imageURL: attr('string'),
  imageBlob: attr('string'),
  isNumber: Ember.computed.match('price', /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/),
  isValidNumber: Ember.computed.and('isNumber', 'price'),
  isLongName: Ember.computed.gte('name.length', 5),
  isLongDesc: Ember.computed.gte('desc.length', 5),
  updating: Ember.computed.or('isUpdating', 'isDeleting'),
  isUpdating: '',
  isDeleting: '',
  isNotUpdating: Ember.computed.not('updating'),
  isValid: Ember.computed.and('isLongName', 'isLongDesc', 'isValidNumber', 'imageURL', 'isNotUpdating'),
  isNotValid: Ember.computed.not('isValid'),
});