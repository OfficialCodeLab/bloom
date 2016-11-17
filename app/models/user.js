import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
  name: attr('string'),
  surname: attr('string'),
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
  vendorAccount: attr('string'),
  innercircle: hasMany('userstats'),
  preference: attr('string'),
  birthday: attr('date'),
  wedding: hasMany('wedding', {inverse: 'user', async: true})
});
