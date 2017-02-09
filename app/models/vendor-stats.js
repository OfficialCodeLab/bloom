
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  willingToTravel: attr('boolean'),
  categories: hasMany('category'),
  servicesDesc: attr('string'),
  createdBy: attr('string'),
  repName: attr('string'),
  vatNum: attr('string'),
  website: attr('string')

});
