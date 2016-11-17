import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';
import attr from 'ember-data/attr';


export default Model.extend({
  guests: hasMany('guest', {inverse: 'wedding', async: true}),
  user: belongsTo('user', {inverse: 'wedding', async: true}),
  weddingDate: attr('date'),
  budgetUsed: attr('string'),
  budgetTotal: attr('string'),
  guestsAttending: attr('string'),
  guestsTotal: attr('string'),
  hasGuests: attr('boolean')
});
