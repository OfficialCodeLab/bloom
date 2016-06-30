import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  to: attr('string'),
  from: attr('string'),
  subject: attr('string'),
  html: attr('string'),

  //Your own name
  senderName: attr('string'),
  senderId: attr('string'),

  //Vendor name
  receiverName: attr('string'),
  receiverId: attr('string')
});
