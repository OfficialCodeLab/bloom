import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';
import attr from 'ember-data/attr';


export default Model.extend({
  guests: hasMany('guest', {inverse: 'wedding', async: true}),
  user: belongsTo('user', {inverse: 'wedding', async: true}),
  tasks: hasMany('task'),
  weddingDate: attr('date'),
  budgetUsed: attr('string'),
  budgetTotal: attr('string'),
  hasBudget: attr('boolean'),
  guestsAttending: attr('string'),
  guestsTotal: attr('string'),
  hasGuests: attr('boolean'),
  // budget: hasMany('budget', {inverse: 'wedding', async: true})
});
