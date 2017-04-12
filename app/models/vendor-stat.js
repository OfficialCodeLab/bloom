
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  willingToTravel: attr('string'),
  maxTravelDist: attr('string'),
  categories: hasMany('category'),
  servicesDesc: attr('string'),
  createdBy: attr('string'),
  created: attr('date'),
  repName: attr('string'),
  vatNum: attr('string'),
  website: attr('string'),
  monthlyAnalytics: attr('string'),
  montlyNewsletter: attr('string'),
  willContribute: attr('string')

});
