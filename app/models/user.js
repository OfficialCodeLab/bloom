import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
  name: attr('string'),
  surname: attr('string'),
  spouse: attr('string'),
  email: attr('string'),
  addressL1: attr('string'),
  addressL2: attr('string'),
  city: attr('string'),
  country: attr('string'),
  postalcode: attr('string'),
  cell: attr('string'),
  accountType: attr('string'),
  favourites: hasMany('cat-item'),
  isFemale: attr('boolean'),
  hasGender: attr('boolean'),
  vendorRequest: attr('boolean'),
  vendorAccount: belongsTo('vendor', {inverse: 'loggedInUsers', async: true}),
  innercircle: hasMany('userstats'),
  isNewToBloom: attr('boolean'),
  imgurl: attr('string'),
  preference: attr('string'),
  birthday: attr('date'),
  specialAccount: attr('boolean'),
  mustTourWedding: attr('boolean'),
  mustTourVendor: attr('boolean'),
  mustTourFavourites: attr('boolean'),
  created: attr('string'),
  wedding: hasMany('wedding', {inverse: 'user', async: true})
});
