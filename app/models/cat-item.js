import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  desc: attr('string'),
  price: attr('string'),
  category: belongsTo('category', {inverse: 'catItems', async: true}),
  vendor: belongsTo('vendor', {inverse: 'catItems', async: true}),
  imageURL: attr('string'),
  imageBlob: attr('string'),
  isNumber: Ember.computed.match('price', /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/),
  isValidNumber: Ember.computed.and('isNumber', 'price'),
  isLongName: Ember.computed.gte('name.length', 5),
  isLongDesc: Ember.computed.gte('desc.length', 5),
  isCreating: '',
  isNotCreating: Ember.computed.not('isCreating'),
  isValid: Ember.computed.and('isLongName', 'isLongDesc', 'isValidNumber', 'imageURL', 'isNotCreating'),
  isNotValid: Ember.computed.not('isValid'),
});