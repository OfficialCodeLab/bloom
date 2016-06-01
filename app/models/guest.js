import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  email: attr('string'),
  cell: attr('string'),
  guests: attr('string'),
  rsvp: attr('boolean'),
  guestList: belongsTo('guest-list', {inverse: 'guests', async: true})
});