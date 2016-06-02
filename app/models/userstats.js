import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  height: attr('string'),
  shoulders: attr('string'),
  chest: attr('string'),
  waist: attr('string'),
  hips: attr('string'),
  inseam: attr('string'),
  gender: attr('string'),
  shoesize: attr('string')
});
