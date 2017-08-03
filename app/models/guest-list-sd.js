import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

export default Model.extend({
  dateSent: attr('string'),
  completed: attr('string'),
  guestCount: attr('string'),
  details: attr(),
  errors: attr()
});
