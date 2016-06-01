import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  guests: hasMany('guest', {inverse: 'wedding', async: true}),
  user: belongsTo('user', {inverse: 'wedding', async: true})
});
