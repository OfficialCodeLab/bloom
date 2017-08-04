import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['id', 'accept', 'decline'],
  id: null,
  accept: null,
  decline: null,
});
