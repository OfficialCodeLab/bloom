import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  password: attr('string'),
  email: attr('string'),
  vendorID: attr('string')
});
