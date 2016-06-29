import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  to: attr('string'),
  from: attr('string'),
  subject: attr('string'),
  html: attr('string'),
  senderName: attr('string'),
  senderId: attr('string'),  
  receiverName: attr('string'),
  receiverId: attr('string')
});
