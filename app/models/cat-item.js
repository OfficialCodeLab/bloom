import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  category: belongsTo('category', {inverse: 'catItems', async: true}),
  vendor: belongsTo('vendor', {inverse: 'catItems', async: true}),
  imageURL: attr('string')
});
